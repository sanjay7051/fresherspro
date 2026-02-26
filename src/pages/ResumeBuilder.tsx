import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import html2pdf from "html2pdf.js";
import ResumePreview, {
  type ResumeData,
  emptyResume,
} from "@/components/ResumePreview";

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border/80 bg-card shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] p-6 space-y-5">
    <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">{title}</h3>
    {children}
  </div>
);

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-sm font-bold text-foreground">{label}</Label>
    {children}
  </div>
);

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 🔹 Controlled update with validation
  const update = useCallback(
    (field: keyof ResumeData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = e.target.value;

        // Full Name → Auto uppercase
        if (field === "fullName") {
          value = value.toUpperCase();
        }

        // Phone → Only 10 digits numeric
        if (field === "phone") {
          value = value.replace(/\D/g, "").slice(0, 10);
        }

        setData((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const handleGenerateResume = async () => {
    if (!data.fullName) {
      toast.error("Full Name is required.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: data }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const enhanced = await response.json();

      // Only replace fields AI returned (safe merge)
      setData((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(enhanced).filter(([_, v]) => v)
        ),
      }));

      toast.success("Resume enhanced successfully!");
    } catch (error) {
      console.error("AI ERROR:", error);
      toast.error("AI enhancement failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    await html2pdf()
      .set({
        margin: 0.3,
        filename: `${data.fullName || "Resume"}_FreshersPro.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(previewRef.current)
      .save();

    toast.success("Resume downloaded successfully!");
  };


  const inputClass = "h-12 rounded-lg border-border bg-white shadow-none text-foreground text-[15px] px-4 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/60 focus-visible:ring-offset-0 transition-colors placeholder:text-muted-foreground/50";
  const textareaClass = "min-h-[200px] rounded-lg border-border bg-white shadow-none text-foreground text-[15px] px-4 py-4 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/60 focus-visible:ring-offset-0 transition-colors placeholder:text-muted-foreground/50";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(210 20% 98%)" }}>
      <div className="container mx-auto px-4 py-10 lg:py-12 grid lg:grid-cols-2 gap-14 max-w-7xl">

        {/* FORM */}
        <div className="space-y-8">
          <div className="mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Resume Builder</h1>
            <p className="text-sm text-muted-foreground mt-1">Fill in your details to generate a professional resume</p>
          </div>

          {/* Personal Details */}
          <SectionCard title="Personal Details">
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldWrapper label="Full Name">
                <Input
                  value={data.fullName}
                  onChange={update("fullName")}
                  placeholder="ENTER YOUR FULL NAME"
                  className={inputClass}
                />
              </FieldWrapper>

              <FieldWrapper label="Phone (10 digits)">
                <Input
                  value={data.phone}
                  onChange={update("phone")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={inputClass}
                />
              </FieldWrapper>
            </div>

            <FieldWrapper label="Email">
              <Input
                type="email"
                value={data.email}
                onChange={update("email")}
                placeholder="example@gmail.com"
                className={inputClass}
              />
            </FieldWrapper>

            <div className="grid sm:grid-cols-2 gap-4">
              <FieldWrapper label="LinkedIn">
                <Input
                  value={data.linkedin}
                  onChange={update("linkedin")}
                  placeholder="linkedin.com/in/yourprofile"
                  className={inputClass}
                />
              </FieldWrapper>

              <FieldWrapper label="GitHub">
                <Input
                  value={data.github || ""}
                  onChange={update("github")}
                  placeholder="github.com/yourusername"
                  className={inputClass}
                />
              </FieldWrapper>
            </div>
          </SectionCard>

          {/* Professional Summary */}
          <SectionCard title="Professional Summary">
            <FieldWrapper label="Career Objective / Summary">
              <Textarea
                value={data.careerObjective}
                onChange={update("careerObjective")}
                placeholder="Write a brief professional summary..."
                className={textareaClass}
              />
            </FieldWrapper>
          </SectionCard>

          {/* Experience */}
          <SectionCard title="Experience">
            <FieldWrapper label="Work Experience (one entry per line)">
              <Textarea
                value={data.experience}
                onChange={update("experience")}
                placeholder="Developed REST APIs using Node.js&#10;Automated CI/CD pipeline with GitHub Actions"
                className={textareaClass}
              />
            </FieldWrapper>
          </SectionCard>

          {/* Projects */}
          <SectionCard title="Projects">
            <FieldWrapper label="Projects (one entry per line)">
              <Textarea
                value={data.projects}
                onChange={update("projects")}
                placeholder="E-Commerce App — Built with React and Firebase&#10;Portfolio Website — Designed responsive layout with Tailwind"
                className={textareaClass}
              />
            </FieldWrapper>
          </SectionCard>

          {/* Skills */}
          <SectionCard title="Skills">
            <FieldWrapper label="Programming Languages">
              <Input
                value={data.programmingLanguages}
                onChange={update("programmingLanguages")}
                placeholder="Python, Java, C++"
                className={inputClass}
              />
            </FieldWrapper>
          </SectionCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating}
              size="lg"
              className="rounded-lg shadow-sm font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Enhance Resume
                </>
              )}
            </Button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <div className="rounded-xl border border-border/80 bg-card shadow-[0_1px_3px_0_rgb(0_0_0/0.04)] overflow-hidden max-w-[620px] mx-auto">
              <div className="px-5 py-3 border-b border-border/60 bg-muted/20">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">Live Preview</h3>
              </div>
              <div className="overflow-visible">
                <div className="transform origin-top scale-[0.75] w-[133.33%] mx-auto">
                  <ResumePreview
                    data={data}
                    isPaid={true}
                    previewRef={previewRef}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              size="lg"
              className="mt-4 max-w-[620px] mx-auto w-full rounded-lg shadow-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF – ₹49
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;