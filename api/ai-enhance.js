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
                    model: "llama-3.1-8b-instant",
                    temperature: 0.7,
                    response_format: { type: "json_object" }, // 🔥 IMPORTANT
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a professional ATS resume writer. Return only valid JSON.",
                        },
                        {
                            role: "user",
                            content: `
Enhance the resume professionally.

Rules:
- Rewrite content.
- Use strong action verbs.
- Bullet points separated by newline.
- Skills must be comma separated.
- Keep realistic for fresher.

Return this JSON:

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
`,
                        },
                    ],
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq Error:", data);
            return res.status(500).json({ error: "Groq failed" });
        }

        // No parsing drama now
        const aiOutput = JSON.parse(
            data.choices[0].message.content
        );

        return res.status(200).json(aiOutput);

    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}