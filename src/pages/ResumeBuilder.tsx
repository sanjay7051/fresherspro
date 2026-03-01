import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import html2pdf from "html2pdf.js";
import ResumePreviewV2 from "@/components/resume/ResumePreviewV2";
import ResumeFormV2 from "@/components/resume/ResumeFormV2";
import type { ResumeData } from "@/types/resume";
import { emptyResume } from "@/types/resume";

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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

      if (!response.ok) throw new Error("AI request failed");

      const enhanced = await response.json();
      setData((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.entries(enhanced).filter(([_, v]) => v)),
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
        margin: 0,
        filename: `${data.fullName || "Resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(previewRef.current)
      .save();

    toast.success("Resume downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1100px] mx-auto px-6 py-10 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Resume Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build a professional, ATS-friendly resume
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* FORM */}
          <div className="space-y-6">
            <ResumeFormV2 data={data} setData={setData} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleGenerateResume}
                disabled={isGenerating}
                size="lg"
                className="rounded-lg font-medium"
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
          <div>
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 border-b border-border">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Live Preview
                  </h3>
                </div>
                <div className="overflow-hidden bg-muted/30 p-4">
                  <div
                    className="origin-top-left"
                    style={{
                      transform: "scale(0.52)",
                      width: "794px",
                      transformOrigin: "top left",
                    }}
                  >
                    <ResumePreviewV2 data={data} previewRef={previewRef} />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                size="lg"
                className="w-full rounded-lg font-medium"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF – ₹49
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
