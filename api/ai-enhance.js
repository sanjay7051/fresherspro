export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { content } = req.body;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.7,
                    messages: [
                        {
                            role: "system",
                            content: `
You are a professional ATS resume writer.

STRICT RULES:
- Rewrite and improve content.
- DO NOT copy original text.
- Make it professional and impact-driven.
- Use strong action verbs.
- Keep skills concise (NO paragraphs).
- Experience and Projects MUST be bullet points separated by newline.
- Certifications must be short and clean (only title + provider).
- Keep content realistic for a fresher.
- Do NOT return explanations.
- Return ONLY valid JSON.
`
                        },
                        {
                            role: "user",
                            content: `
Enhance the following resume data.

Return ONLY this exact JSON structure:

{
  "careerObjective": "",
  "experience": "",
  "projects": "",
  "programmingLanguages": "",
  "frameworksLibraries": "",
  "toolsPlatforms": "",
  "databases": "",
  "softSkills": "",
  "certifications": ""
}

Formatting Rules:
- Bullet points separated by "\\n"
- Skills must be comma-separated (not paragraphs)
- No markdown
- No extra text outside JSON

Resume Data:
${JSON.stringify(content)}
`
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", data);
            return res.status(500).json({
                error: "Groq API failed",
                details: data,
            });
        }

        let aiText = data?.choices?.[0]?.message?.content;

        if (!aiText) {
            return res.status(500).json({
                error: "AI returned empty response",
            });
        }

        // Remove markdown wrapping if any
        aiText = aiText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON safely
        const firstBrace = aiText.indexOf("{");
        const lastBrace = aiText.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            return res.status(500).json({
                error: "AI did not return valid JSON",
                rawOutput: aiText,
            });
        }

        const jsonString = aiText.substring(firstBrace, lastBrace + 1);

        let parsed;

        try {
            parsed = JSON.parse(jsonString);
        } catch (err) {
            return res.status(500).json({
                error: "Failed to parse AI JSON",
                rawOutput: aiText,
            });
        }

        return res.status(200).json(parsed);

    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}