import type { ResumeData, ExperienceEntry, ProjectEntry } from "@/types/resume";

const ACTION_VERBS = [
  "Spearheaded", "Engineered", "Architected", "Optimized", "Delivered",
  "Implemented", "Streamlined", "Developed", "Orchestrated", "Accelerated",
  "Designed", "Led", "Built", "Automated", "Reduced", "Increased",
  "Launched", "Transformed", "Drove", "Executed", "Resolved", "Elevated",
];

const WEAK_STARTS = [
  "worked on", "helped with", "was responsible for", "assisted in",
  "participated in", "involved in", "did", "made", "used", "handled",
  "managed to", "was part of", "contributed to",
];

function pickVerb(index: number): string {
  return ACTION_VERBS[index % ACTION_VERBS.length];
}

function enhanceBullet(bullet: string, index: number): string {
  let text = bullet.trim();
  if (!text) return text;

  // Remove leading dashes/dots
  text = text.replace(/^[-•·]\s*/, "");

  // Replace weak starts with strong action verbs
  const lower = text.toLowerCase();
  for (const weak of WEAK_STARTS) {
    if (lower.startsWith(weak)) {
      text = text.slice(weak.length).trim();
      // Capitalize first char of remaining
      text = pickVerb(index) + " " + text.charAt(0).toLowerCase() + text.slice(1);
      break;
    }
  }

  // If doesn't start with a capital action verb, prepend one
  const firstWord = text.split(" ")[0];
  const startsWithVerb = ACTION_VERBS.some(
    (v) => firstWord.toLowerCase() === v.toLowerCase()
  );
  if (!startsWithVerb && text.length > 0) {
    text = pickVerb(index) + " " + text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Trim to max ~20 words
  const words = text.split(/\s+/);
  if (words.length > 22) {
    text = words.slice(0, 20).join(" ");
    // Clean trailing prepositions/articles
    text = text.replace(/\s+(the|a|an|in|on|at|to|for|of|with|and|or)$/i, "");
  }

  // Ensure ends with period
  if (!text.endsWith(".")) text += ".";

  // Capitalize first letter
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return text;
}

function enhanceSummary(summary: string): string {
  if (!summary.trim()) return summary;
  let text = summary.trim();
  // Remove first-person pronouns
  text = text.replace(/\bI am\b/gi, "A professional");
  text = text.replace(/\bI have\b/gi, "Possesses");
  text = text.replace(/\bI\b/g, "");
  text = text.replace(/\bmy\b/gi, "");
  // Clean double spaces
  text = text.replace(/\s{2,}/g, " ").trim();
  if (!text.endsWith(".")) text += ".";
  return text;
}

export function enhanceResume(data: ResumeData): ResumeData {
  let verbIdx = 0;

  const experience: ExperienceEntry[] = data.experience.map((exp) => ({
    ...exp,
    bullets: exp.bullets.map((b) => enhanceBullet(b, verbIdx++)),
  }));

  const projects: ProjectEntry[] = data.projects.map((proj) => ({
    ...proj,
    bullets: proj.bullets.map((b) => enhanceBullet(b, verbIdx++)),
  }));

  const summary = enhanceSummary(data.summary);

  return { ...data, summary, experience, projects };
}
