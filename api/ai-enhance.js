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
                    messages: [
                        {
                            role: "system",
                            content: "You are a professional resume writer. Return ONLY valid JSON."
                        },
                        {
                            role: "user",
                            content: `
Return improved resume in this exact JSON format:

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
                    temperature: 0.7
                }),
            }
        );

        const data = await response.json();

        const aiText =
            data?.choices?.[0]?.message?.content || "{}";

        let parsed;
        try {
            parsed = JSON.parse(aiText);
        } catch {
            parsed = {
                careerObjective: aiText
            };
        }

        return res.status(200).json(parsed);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}