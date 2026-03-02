import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, BarChart3, AlertTriangle, CheckCircle2, FileText, X } from "lucide-react";

interface ATSResult {
  score: number;
  breakdown: { label: string; score: number; max: number }[];
  suggestions: string[];
  missingKeywords: string[];
}

/* -------------------- ATS LOGIC -------------------- */

function analyzeATS(text: string): ATSResult {
  const normalized = text
    .toLowerCase()
    .replace(/[:\-–—]/g, " ")
    .replace(/\s+/g, " ");

  const sectionMap: Record<string, string[]> = {
    education: ["education", "academic background", "qualification"],
    skills: ["skills", "technical skills"],
    experience: ["experience", "work experience", "internship"],
    projects: ["projects", "project"],
    objective: ["objective", "summary", "professional summary"],
    certifications: ["certifications", "certificate", "additional course"],
  };

  const foundSections = Object.entries(sectionMap).filter(([_, variants]) =>
    variants.some((v) => normalized.includes(v))
  );

  const sectionScore = Math.round(
    (foundSections.length / Object.keys(sectionMap).length) * 20
  );

  const commonKeywords = [
    "python", "java", "javascript", "react", "sql", "html", "css", "git",
    "communication", "teamwork", "leadership", "problem solving",
    "machine learning", "data", "api", "database", "cloud", "agile",
  ];

  const foundKeywords = commonKeywords.filter((k) =>
    normalized.includes(k)
  );

  const keywordScore = Math.min(
    25,
    Math.round((foundKeywords.length / 8) * 25)
  );

  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  const uniqueWords = new Set(words);

  const skillScore = Math.min(
    30,
    Math.round((uniqueWords.size / 50) * 30)
  );

  const hasBullets = /[•\-\*]/.test(text);
  const hasLineBreaks = text.split("\n").length > 5;
  const hasNumbers = /\d+/.test(text);

  const formatScore =
    (hasBullets ? 5 : 0) +
    (hasLineBreaks ? 5 : 0) +
    (hasNumbers ? 5 : 0);

  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 3);

  const grammarScore = Math.min(
    10,
    Math.round((sentences.length / 10) * 10)
  );

  const total =
    sectionScore +
    keywordScore +
    skillScore +
    formatScore +
    grammarScore;

  const suggestions: string[] = [];

  const missingSections = Object.entries(sectionMap)
    .filter(([_, variants]) =>
      !variants.some((v) => normalized.includes(v))
    )
    .map(([key]) => key);

  if (missingSections.length > 0)
    suggestions.push(`Add missing sections: ${missingSections.join(", ")}`);

  if (!hasBullets)
    suggestions.push("Use bullet points for better readability");

  if (foundKeywords.length < 5)
    suggestions.push("Add more industry-relevant keywords");

  if (sentences.length < 5)
    suggestions.push("Add more descriptive sentences");

  if (!hasNumbers)
    suggestions.push("Include quantified achievements (numbers, percentages)");

  const missingKeywords = commonKeywords
    .filter((k) => !normalized.includes(k))
    .slice(0, 8);

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

/* -------------------- COMPONENT -------------------- */

const ATSChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    const text = await file.text();
    setResult(analyzeATS(text));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <BarChart3 className="mx-auto h-10 w-10 text-primary mb-4" />
          <h1 className="text-3xl font-bold">ATS Score Checker</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume to get an ATS simulation score
          </p>
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed p-10 text-center"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          <Upload className="mx-auto h-8 w-8 mb-3" />
          <p>Click to upload your resume (PDF)</p>
        </div>

        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm">{file.name}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button onClick={handleAnalyze}>
            Analyze ATS Score
          </Button>
        </div>

        {result && (
          <div className="mt-10 space-y-8">

            {/* Total Score */}
            <div className="text-center">
              <h2 className="text-5xl font-bold">{result.score} / 100</h2>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              {result.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{b.label}</span>
                    <span>{b.score}/{b.max}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(b.score / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="text-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
              >
                Rebuild My Resume Professionally
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ATSChecker;