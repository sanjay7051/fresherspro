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
                    model: "llama3-8b-8192",
                    temperature: 0.8,
                    messages: [
                        {
                            role: "system",
                            content: `
You are a professional ATS resume writer.

You MUST rewrite and improve the resume content.
Do NOT copy input text.
Expand weak points.
Make it professional and impact-focused.
Use action verbs.
Quantify results if possible.

Return ONLY valid JSON.
Do not include explanations.
`
                        },
                        {
                            role: "user",
                            content: `
Rewrite and professionally enhance this resume.

Rules:
- Improve grammar.
- Make bullet points stronger.
- Expand very short entries.
- Add measurable impact when possible.
- Keep it realistic for a fresher.
- If a section is empty, generate a strong professional version.

Return ONLY this JSON structure:

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

Resume Data:
${JSON.stringify(content)}
`
                        }
                    ],
                }),
            }
        );

        const data = await response.json();

        const aiText =
            data?.choices?.[0]?.message?.content?.trim() || "{}";

        let parsed;

        try {
            parsed = JSON.parse(aiText);
        } catch {
            // fallback clean
            parsed = {
                careerObjective: aiText,
                experience: "",
                projects: "",
                programmingLanguages: "",
                frameworksLibraries: "",
                toolsPlatforms: "",
                databases: "",
                softSkills: "",
                certifications: ""
            };
        }

        return res.status(200).json(parsed);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}