export function formatText(text: string) {
    if (!text) return "";

    const corrections: Record<string, string> = {
        "aws": "AWS",
        "certified": "Certified",
        "tap acadamy": "Tap Academy",
        "acadamy": "Academy",
        "hackathon": "Hackathon",
        "internatinaol": "International",
        "samrt": "Smart",
        "firebase": "Firebase",
        "python": "Python"
    };

    let formatted = text.toLowerCase();

    // fix spelling words
    Object.keys(corrections).forEach(word => {
        const regex = new RegExp(word, "gi");
        formatted = formatted.replace(regex, corrections[word]);
    });

    // fix "in2023" → "in 2023"
    formatted = formatted.replace(/in(\d{4})/g, "in $1");

    // remove extra spaces
    formatted = formatted.replace(/\s+/g, " ").trim();

    // capitalize first letter
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    return formatted;
}