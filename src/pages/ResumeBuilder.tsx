import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import html2pdf from "html2pdf.js";
import ResumePreviewV2 from "@/components/resume/ResumePreviewV2";
import ResumeFormV2 from "@/components/resume/ResumeFormV2";
import EnhancePreviewModal from "@/components/resume/EnhancePreviewModal";
import type { ResumeData } from "@/types/resume";
import { emptyResume } from "@/types/resume";
import { enhanceResume } from "@/lib/enhance-resume";

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [enhancedData, setEnhancedData] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleGenerateResume = () => {
    if (!data.fullName) {
      toast.error("Full Name is required.");
      return;
    }

    const hasContent =
      data.summary.trim() ||
      data.experience.some((e) => e.bullets.some((b) => b.trim())) ||
      data.projects.some((p) => p.bullets.some((b) => b.trim()));

    if (!hasContent) {
      toast.error("Add some content to enhance (summary, experience, or projects).");
      return;
    }

    const result = enhanceResume(data);
    setEnhancedData(result);
    setShowPreview(true);
  };

  const handleAcceptEnhancement = () => {
    if (enhancedData) {
      setData(enhancedData);
      setEnhancedData(null);
      setShowPreview(false);
      toast.success("Resume enhanced successfully!");
    }
  };

  const handleDownloadPDF = async () => {
    if (data.phone && data.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }
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
                size="lg"
                className="rounded-lg font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Enhance Resume
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

      {enhancedData && (
        <EnhancePreviewModal
          open={showPreview}
          onClose={() => setShowPreview(false)}
          original={data}
          enhanced={enhancedData}
          onAccept={handleAcceptEnhancement}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
