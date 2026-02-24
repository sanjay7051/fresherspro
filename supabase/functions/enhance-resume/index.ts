import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a professional resume writing expert specializing in the Indian job market. You produce ATS-optimized, concise, recruiter-ready resume content.

RULES:
- No emojis, decorative symbols, or special characters.
- Use clean, professional English.
- Keep content concise — fresher resumes must fit 1 page.
- Use consistent past tense for completed work, present tense for current roles.
- Never use generic phrases like "seeking a challenging position" or "hardworking individual".

You will receive a JSON object with the user's raw resume data and must return an enhanced JSON object.`;

const USER_PROMPT_TEMPLATE = (data: Record<string, unknown>) => `
Enhance this resume data for an Indian job market audience. Return ONLY a valid JSON object with these exact keys:

{
  "careerObjective": "...",
  "experience": "...",
  "projects": "...",
  "programmingLanguages": "...",
  "frameworksLibraries": "...",
  "toolsPlatforms": "...",
  "databases": "...",
  "softSkills": "...",
  "certifications": "..."
}

INSTRUCTIONS FOR EACH FIELD:

**careerObjective**: 
- If the person appears to be a fresher (no/minimal experience): Write a 3-4 line confident, results-oriented professional summary highlighting technical strengths, academic projects, internship exposure, and career direction.
- If experienced: Highlight measurable impact, domain experience, tools used, and specialization.
- Use powerful action-driven language. No generic filler.

**experience**:
- Convert any paragraph text into professional bullet points, one per line.
- Each bullet MUST start with a strong action verb (Developed, Implemented, Optimized, Designed, Led, Automated, Architected, Streamlined, etc.).
- Include tools/technologies used in each bullet.
- Add measurable impact where possible (improved X by Y%, reduced Z by N%).
- If the user wrote "fresher" or left it empty, generate 2-3 bullets about academic project contributions, technical training, or internship-style work based on their skills and projects.

**projects**:
- Format each project as: "Project Title — Brief description using technologies X, Y, Z. Key contribution: [specific outcome]."
- One project per line.
- If technologies aren't specified, infer from the user's skills.

**programmingLanguages**: Extract and deduplicate programming languages from all skill fields. Comma-separated.
**frameworksLibraries**: Extract frameworks and libraries. Comma-separated.
**toolsPlatforms**: Extract tools and platforms (Git, Docker, AWS, VS Code, etc.). Comma-separated.
**databases**: Extract database technologies. If none mentioned, return empty string. Comma-separated.
**softSkills**: Clean and professionalize soft skills. Comma-separated.

**certifications**:
- Format each as: "Certificate Name | Issuing Organization | Year"
- One per line. If year/org is missing, omit that part.
- Keep it clean and structured.

Here is the user's raw resume data:
${JSON.stringify(data, null, 2)}
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resumeData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: USER_PROMPT_TEMPLATE(resumeData) },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", status, text);
      return new Response(
        JSON.stringify({ error: "AI enhancement failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    try {
      const enhanced = JSON.parse(jsonStr);
      return new Response(
        JSON.stringify(enhanced),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch {
      console.error("Failed to parse AI response as JSON:", content);
      return new Response(
        JSON.stringify({ error: "AI returned invalid format. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.error("enhance-resume error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
