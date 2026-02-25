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
You are an expert resume writer.

Rules:
- Always rewrite and improve the content.
- Expand short inputs into professional bullet points.
- If user says "Fresher", generate internship-style academic experience.
- Use strong action verbs.
- Make content ATS-friendly.
- Return ONLY valid JSON.
- Do not explain anything.
- Do not wrap JSON in markdown.
`
                        },
                        {
                            role: "user",
                            content: `
Rewrite and enhance this resume data professionally.

Return output in EXACT JSON format:

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

Resume data:
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