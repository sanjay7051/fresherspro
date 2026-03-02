import { useState, useRef } from "react";
import { Link } from "react-router-dom";
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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type))
      return "Only PDF, JPG, and PNG files are accepted.";
    if (f.size > MAX_SIZE_BYTES)
      return `File exceeds ${MAX_SIZE_MB}MB limit.`;
    return null;
  };

  const extractTextFromFile = async (f: File): Promise<string> => {
    return await f.text(); // simple MVP text extraction
  };

  const handleFile = (f: File) => {
    setResult(null);
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const text = await extractTextFromFile(file);
      setResult(analyzeATS(text));
    } catch {
      setError("Failed to process file.");
    } finally {
      setAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
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
          <p className="mt-2 text-muted-foreground">
            Upload your resume to get an ATS simulation score
          </p>
        </div>

        {/* Upload */}
        <div
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-border p-10 text-center hover:border-primary/50"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">
            Drag & drop or click to upload (PDF, JPG, PNG — Max 10MB)
          </p>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive font-medium">{error}</p>
        )}

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
            <FileText className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button onClick={() => setFile(null)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={handleAnalyze} disabled={!file || analyzing}>
            {analyzing ? "Analyzing…" : "Analyze ATS Score"}
          </Button>
        </div>

        {result && (
          <div className="mt-10 text-center">
            <h2 className="text-5xl font-bold">{result.score} / 100</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSChecker;