import { useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Download, Lock, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import html2pdf from "html2pdf.js";
import ResumePreview, { type ResumeData, emptyResume } from "@/components/ResumePreview";

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const isPaid = !!downloadToken;

  const update = useCallback(
    (field: keyof ResumeData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  // ✅ FIXED: AI Enhance now uses Vercel API (NOT Supabase)
  const handleGenerateResume = async () => {
    const hasContent =
      data.fullName ||
      data.experience ||
      data.projects ||
      data.programmingLanguages ||
      data.degree;

    if (!hasContent) {
      toast.error("Please fill in at least your name, skills, or education before generating.");
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
        toast.error("AI enhancement failed. Please try again.");
        return;
      }

      const result = await response.json();
      const enhanced = result.result;

      setData((prev) => ({
        ...prev,
        careerObjective: enhanced.careerObjective || prev.careerObjective,
        experience: enhanced.experience || prev.experience,
        projects: enhanced.projects || prev.projects,
        programmingLanguages:
          enhanced.programmingLanguages || prev.programmingLanguages,
        frameworksLibraries:
          enhanced.frameworksLibraries || prev.frameworksLibraries,
        toolsPlatforms: enhanced.toolsPlatforms || prev.toolsPlatforms,
        databases: enhanced.databases || prev.databases,
        softSkills: enhanced.softSkills || prev.softSkills,
        certifications: enhanced.certifications || prev.certifications,
      }));

      toast.success("Resume enhanced with AI! Review the changes below.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    const element = previewRef.current;

    const opt = {
      margin: 0.3,
      filename: `${data.fullName || "Resume"}_FreshersPro.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();
    toast.success("Resume downloaded successfully!");
  };

  // ✅ Keep Supabase ONLY for payment verification
  const handlePayAndDownload = async () => {
    if (isPaid) {
      handleDownloadPDF();
      return;
    }

    setIsProcessing(true);

    try {
      const { data: result, error } = await supabase.functions.invoke(
        "verify-payment",
        { body: { mock: true } }
      );

      if (error || !result?.download_token) {
        toast.error("Payment verification failed. Please try again.");
        return;
      }

      setDownloadToken(result.download_token);
      toast.success("Payment verified! Downloading your resume...");
      setTimeout(() => handleDownloadPDF(), 500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-lg font-bold text-primary">FreshersPro</span>
          <div className="flex gap-2">
            <Link to="/ats">
              <Button variant="outline" size="sm">
                Check ATS Score
              </Button>
            </Link>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleGenerateResume}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Enhance Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Your Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={data.fullName}
                  onChange={update("fullName")}
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={update("phone")}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="careerObjective">Professional Summary</Label>
              <Textarea
                id="careerObjective"
                value={data.careerObjective}
                onChange={update("careerObjective")}
                rows={3}
                placeholder="Leave blank and click 'AI Enhance Resume' to auto-generate a professional summary."
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Live Preview
            </h2>
            <ResumePreview
              data={data}
              isPaid={isPaid}
              previewRef={previewRef}
            />
            <Button
              onClick={handlePayAndDownload}
              className="w-full mt-4 gap-2"
              size="lg"
              disabled={isProcessing}
            >
              {isPaid ? (
                <>
                  <Download className="h-4 w-4" /> Download PDF
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {isProcessing
                    ? "Processing..."
                    : "Unlock & Download PDF – ₹49"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;