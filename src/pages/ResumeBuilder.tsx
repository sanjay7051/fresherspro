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

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (field: keyof ResumeData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  const handleGenerateResume = async () => {
    const hasContent =
      data.fullName ||
      data.experience ||
      data.projects ||
      data.programmingLanguages ||
      data.degree;

    if (!hasContent) {
      toast.error("Please fill in some details before generating.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/ai-enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const enhanced = await response.json();

      console.log("AI RESPONSE:", enhanced); // 🔍 Debug log

      setData((prev) => ({
        ...prev,
        careerObjective:
          enhanced.careerObjective || prev.careerObjective,
        experience: enhanced.experience || prev.experience,
        projects: enhanced.projects || prev.projects,
        programmingLanguages:
          enhanced.programmingLanguages ||
          prev.programmingLanguages,
        frameworksLibraries:
          enhanced.frameworksLibraries ||
          prev.frameworksLibraries,
        toolsPlatforms:
          enhanced.toolsPlatforms || prev.toolsPlatforms,
        databases: enhanced.databases || prev.databases,
        softSkills: enhanced.softSkills || prev.softSkills,
        certifications:
          enhanced.certifications || prev.certifications,
      }));

      toast.success("Resume enhanced successfully!");
    } catch (error) {
      console.error("AI ERROR:", error);
      toast.error("Something went wrong.");
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
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(previewRef.current)
      .save();

    toast.success("Resume downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 grid lg:grid-cols-2 gap-8">

        {/* FORM */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Your Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={data.fullName}
                onChange={update("fullName")}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={data.phone}
                onChange={update("phone")}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input
              value={data.email}
              onChange={update("email")}
            />
          </div>

          <div>
            <Label>Professional Summary</Label>
            <Textarea
              value={data.careerObjective}
              onChange={update("careerObjective")}
            />
          </div>

          <div>
            <Label>Experience</Label>
            <Textarea
              value={data.experience}
              onChange={update("experience")}
            />
          </div>

          <div>
            <Label>Projects</Label>
            <Textarea
              value={data.projects}
              onChange={update("projects")}
            />
          </div>

          <div>
            <Label>Programming Languages</Label>
            <Input
              value={data.programmingLanguages}
              onChange={update("programmingLanguages")}
            />
          </div>

          <Button
            onClick={handleGenerateResume}
            disabled={isGenerating}
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

        {/* PREVIEW */}
        <div>
          <ResumePreview
            data={data}
            isPaid={true}
            previewRef={previewRef}
          />

          <Button
            onClick={handleDownloadPDF}
            className="mt-4 w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ResumeBuilder;