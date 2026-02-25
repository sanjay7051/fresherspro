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
Do NOT copy the input text.
Expand weak points.
Make it professional and impact-focused.
Use strong action verbs.
Quantify results when possible.

Return ONLY valid JSON.
Do NOT include explanations.
`
                        },
                        {
                            role: "user",
                            content: `
Rewrite and professionally enhance this resume.

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

Resume Data:
${JSON.stringify(content)}
`
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        // 🔎 Check if Groq returned error
        if (!response.ok) {
            console.error("Groq API Error:", data);
            return res.status(500).json({
                error: "Groq API failed",
                details: data,
            });
        }

        let aiText = data?.choices?.[0]?.message?.content;

        if (!aiText) {
            console.error("Empty AI response:", data);
            return res.status(500).json({
                error: "AI returned empty response",
                raw: data,
            });
        }

        // 🧹 Remove markdown wrapping if present
        aiText = aiText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // 🧠 Extract JSON block safely
        const firstBrace = aiText.indexOf("{");
        const lastBrace = aiText.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            console.error("No JSON found in AI output:", aiText);
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
            console.error("JSON Parse Error:", err);
            return res.status(500).json({
                error: "Failed to parse AI JSON",
                rawOutput: aiText,
            });
        }

        return res.status(200).json(parsed);

    } catch (err) {
        console.error("Server Error:", err);
        return res.status(500).json({ error: err.message });
    }
}