import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, BarChart3, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ATSResult {
  score: number;
  breakdown: { label: string; score: number; max: number }[];
  suggestions: string[];
  missingKeywords: string[];
}

function analyzeATS(text: string): ATSResult {
  const lower = text.toLowerCase();
  const sections = ["education", "skills", "experience", "projects", "objective", "certifications"];
  const commonKeywords = [
    "python", "java", "javascript", "react", "sql", "html", "css", "git",
    "communication", "teamwork", "leadership", "problem solving",
    "machine learning", "data", "api", "database", "cloud", "agile",
  ];

  // Section completeness (20%)
  const foundSections = sections.filter((s) => lower.includes(s));
  const sectionScore = Math.round((foundSections.length / sections.length) * 20);

  // Keyword density (25%)
  const foundKeywords = commonKeywords.filter((k) => lower.includes(k));
  const keywordScore = Math.min(25, Math.round((foundKeywords.length / 8) * 25));

  // Skills match (30%)
  const skillWords = lower.split(/[\s,;]+/).filter((w) => w.length > 2);
  const uniqueSkills = new Set(skillWords);
  const skillScore = Math.min(30, Math.round((uniqueSkills.size / 40) * 30));

  // Formatting (15%) — check for bullet points, line breaks, structure
  const hasBullets = /[•\-\*]/.test(text);
  const hasLineBreaks = text.split("\n").length > 5;
  const hasNumbers = /\d+/.test(text);
  const formatScore = Math.round(((hasBullets ? 5 : 0) + (hasLineBreaks ? 5 : 0) + (hasNumbers ? 5 : 0)));

  // Grammar proxy (10%) — sentence count & avg length
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  const grammarScore = Math.min(10, Math.round((sentences.length / 10) * 10));

  const total = sectionScore + keywordScore + skillScore + formatScore + grammarScore;

  const suggestions: string[] = [];
  const missingSections = sections.filter((s) => !lower.includes(s));
  if (missingSections.length > 0) suggestions.push(`Add missing sections: ${missingSections.join(", ")}`);
  if (!hasBullets) suggestions.push("Use bullet points for better readability");
  if (foundKeywords.length < 5) suggestions.push("Add more industry-relevant keywords");
  if (sentences.length < 5) suggestions.push("Add more descriptive sentences");
  if (!hasNumbers) suggestions.push("Include quantified achievements (numbers, percentages)");

  const missingKeywords = commonKeywords.filter((k) => !lower.includes(k)).slice(0, 8);

  return {
    score: Math.min(100, total),
    breakdown: [
      { label: "Skills Match", score: skillScore, max: 30 },
      { label: "Keyword Density", score: keywordScore, max: 25 },
      { label: "Section Completeness", score: sectionScore, max: 20 },
      { label: "Formatting", score: formatScore, max: 15 },
      { label: "Grammar Quality", score: grammarScore, max: 10 },
    ],
    suggestions,
    missingKeywords,
  };
}

const ATSChecker = () => {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);

  const handleAnalyze = () => {
    if (resumeText.trim().length < 20) return;
    setResult(analyzeATS(resumeText));
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return "text-score-excellent";
    if (score >= 40) return "text-score-good";
    return "text-score-poor";
  };

  const progressColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 70) return "bg-score-excellent";
    if (pct >= 40) return "bg-score-good";
    return "bg-score-poor";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-lg font-bold text-primary">FreshersPro</span>
          <Link to="/builder">
            <Button size="sm">Build Resume</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ATS Score Checker</h1>
          <p className="mt-2 text-muted-foreground">Paste your resume text below to get an ATS simulation score</p>
          <p className="mt-1 text-xs text-muted-foreground italic">
            ⚠ This is an ATS Simulation Score — for guidance purposes only
          </p>
        </div>

        <Textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={10}
          placeholder="Paste your entire resume content here..."
          className="mb-4"
        />

        <div className="flex gap-3">
          <Button onClick={handleAnalyze} disabled={resumeText.trim().length < 20} className="gap-2">
            <BarChart3 className="h-4 w-4" /> Analyze ATS Score
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setResumeText("");
              setResult(null);
            }}
          >
            Clear
          </Button>
        </div>

        {result && (
          <div className="mt-10 space-y-8">
            {/* Score */}
            <div className="text-center">
              <p className={`text-6xl font-extrabold ${scoreColor(result.score)}`}>
                {result.score}
              </p>
              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
              <div className="mt-4 mx-auto max-w-md">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.score >= 70 ? "bg-score-excellent" : result.score >= 40 ? "bg-score-good" : "bg-score-poor"
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                {result.breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{b.label}</span>
                      <span className="text-muted-foreground">{b.score}/{b.max}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor(b.score, b.max)}`}
                        style={{ width: `${(b.score / b.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-score-good" /> Suggestions
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 text-primary">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missingKeywords.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Consider Adding These Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k) => (
                    <span key={k} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rebuild CTA */}
            <div className="text-center pt-4">
              <Link to="/builder">
                <Button size="lg" className="gap-2">
                  <Upload className="h-4 w-4" /> Rebuild My Resume for Higher ATS Score
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;
