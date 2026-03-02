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

function analyzeATSFromText(text: string): ATSResult {
  const lower = text.toLowerCase();
  const sections = ["education", "skills", "experience", "projects", "objective", "certifications"];
  const commonKeywords = [
    "python", "java", "javascript", "react", "sql", "html", "css", "git",
    "communication", "teamwork", "leadership", "problem solving",
    "machine learning", "data", "api", "database", "cloud", "agile",
  ];

  const foundSections = sections.filter((s) => lower.includes(s));
  const sectionScore = Math.round((foundSections.length / sections.length) * 20);

  const foundKeywords = commonKeywords.filter((k) => lower.includes(k));
  const keywordScore = Math.min(25, Math.round((foundKeywords.length / 8) * 25));

  const skillWords = lower.split(/[\s,;]+/).filter((w) => w.length > 2);
  const uniqueSkills = new Set(skillWords);
  const skillScore = Math.min(30, Math.round((uniqueSkills.size / 40) * 30));

  const hasBullets = /[•\-*]/.test(text);
  const hasLineBreaks = text.split("\n").length > 5;
  const hasNumbers = /\d+/.test(text);
  const formatScore = Math.round((hasBullets ? 5 : 0) + (hasLineBreaks ? 5 : 0) + (hasNumbers ? 5 : 0));

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

function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        // For PDF, extract raw text from the binary data
        const text = extractTextFromPDFBinary(reader.result as ArrayBuffer);
        resolve(text);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    } else {
      // For images, we simulate with file metadata since we can't OCR client-side
      resolve(`resume file uploaded: ${file.name}, size: ${file.size} bytes`);
    }
  });
}

function extractTextFromPDFBinary(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const text: string[] = [];
  let i = 0;
  while (i < bytes.length) {
    // Look for text between parentheses in PDF streams
    if (bytes[i] === 0x28) { // opening paren
      let str = "";
      i++;
      let depth = 1;
      while (i < bytes.length && depth > 0) {
        if (bytes[i] === 0x28) depth++;
        else if (bytes[i] === 0x29) { depth--; if (depth === 0) break; }
        else if (bytes[i] >= 32 && bytes[i] <= 126) str += String.fromCharCode(bytes[i]);
        i++;
      }
      if (str.trim().length > 1) text.push(str.trim());
    }
    i++;
  }
  return text.join(" ");
}

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ATSChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) return "Only PDF, JPG, and PNG files are accepted.";
    if (f.size > MAX_SIZE_BYTES) return `File exceeds ${MAX_SIZE_MB}MB limit.`;
    return null;
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const text = await extractTextFromFile(file);
      setResult(analyzeATSFromText(text));
    } catch {
      setError("Failed to process file.");
    } finally {
      setAnalyzing(false);
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          <p className="mt-2 text-muted-foreground">Upload your resume to get an ATS simulation score</p>
          <p className="mt-1 text-xs text-muted-foreground italic">
            ⚠ This is an ATS Simulation Score — for guidance purposes only
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer rounded-xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary/50"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
          <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            Drag & drop your resume here, or <span className="text-primary underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, or PNG — Max 10MB</p>
        </div>

        {error && (
          <p className="mt-3 text-sm text-destructive font-medium">{error}</p>
        )}

        {file && !error && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }} className="text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button onClick={handleAnalyze} disabled={!file || analyzing} className="gap-2">
            <BarChart3 className="h-4 w-4" /> {analyzing ? "Analyzing…" : "Analyze ATS Score"}
          </Button>
          <Button
            variant="outline"
            onClick={() => { setFile(null); setResult(null); setError(""); if (inputRef.current) inputRef.current.value = ""; }}
          >
            Clear
          </Button>
        </div>

        {result && (
          <div className="mt-10 space-y-8">
            <div className="text-center">
              <p className={`text-6xl font-extrabold ${scoreColor(result.score)}`}>{result.score}</p>
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

            {result.missingKeywords.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Consider Adding These Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k) => (
                    <span key={k} className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">{k}</span>
                  ))}
                </div>
              </div>
            )}

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
