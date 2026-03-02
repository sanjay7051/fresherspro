import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Upload,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  FileText,
  X,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// PDF worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ATSResult {
  score: number;
  breakdown: { label: string; score: number; max: number }[];
  suggestions: string[];
  missingKeywords: string[];
}

/* ================= PDF TEXT EXTRACTION ================= */

async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + " ";
  }

  return fullText;
}

/* ================= ATS ANALYSIS LOGIC ================= */

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
    suggestions.push("Include quantified achievements");

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

/* ================= COMPONENT ================= */

const ATSChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const text = await extractTextFromPDF(file);
      const analysis = analyzeATS(text);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="font-bold text-primary">FreshersPro</span>
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

        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed rounded-xl p-10 text-center"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) =>
              e.target.files && setFile(e.target.files[0])
            }
          />
          <Upload className="mx-auto h-8 w-8 mb-3" />
          <p>Click to upload PDF resume</p>
        </div>

        {file && (
          <div className="mt-4 text-center text-sm">
            {file.name}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button onClick={handleAnalyze} disabled={!file || loading}>
            {loading ? "Analyzing..." : "Analyze ATS Score"}
          </Button>
        </div>

        {result && (
          <div className="mt-10 space-y-8">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-primary">
                {result.score} / 100
              </h2>
            </div>

            {result.breakdown.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{b.label}</span>
                  <span>{b.score}/{b.max}</span>
                </div>
                <div className="h-3 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(b.score / b.max) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {result.suggestions.length > 0 && (
              <div>
                <h3 className="font-semibold">Suggestions</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center">
              <Button
                size="lg"
                onClick={() =>
                  navigate("/builder", { state: result })
                }
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