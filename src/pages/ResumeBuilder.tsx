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

  const handleGenerateResume = async () => {
    const hasContent =
      data.fullName || data.experience || data.projects || data.programmingLanguages || data.degree;

    if (!hasContent) {
      toast.error("Please fill in at least your name, skills, or education before generating.");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: enhanced, error } = await supabase.functions.invoke(
        "enhance-resume",
        { body: data }
      );

      if (error) {
        toast.error("AI enhancement failed. Please try again.");
        console.error("enhance-resume error:", error);
        return;
      }

      setData((prev) => ({
        ...prev,
        careerObjective: enhanced.careerObjective || prev.careerObjective,
        experience: enhanced.experience || prev.experience,
        projects: enhanced.projects || prev.projects,
        programmingLanguages: enhanced.programmingLanguages || prev.programmingLanguages,
        frameworksLibraries: enhanced.frameworksLibraries || prev.frameworksLibraries,
        toolsPlatforms: enhanced.toolsPlatforms || prev.toolsPlatforms,
        databases: enhanced.databases || prev.databases,
        softSkills: enhanced.softSkills || prev.softSkills,
        certifications: enhanced.certifications || prev.certifications,
      }));

      toast.success("Resume enhanced with AI! Review the changes below.");
    } catch {
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
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <span className="text-lg font-bold text-primary">FreshersPro</span>
          <div className="flex gap-2">
            <Link to="/ats">
              <Button variant="outline" size="sm">Check ATS Score</Button>
            </Link>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={handleGenerateResume}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enhancing...</>
              ) : (
                <><Sparkles className="h-3.5 w-3.5" /> AI Enhance Resume</>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Form */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Your Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={data.fullName} onChange={update("fullName")} placeholder="Rahul Sharma" />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" value={data.phone} onChange={update("phone")} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={data.email} onChange={update("email")} placeholder="rahul@email.com" />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                <Input id="linkedin" value={data.linkedin} onChange={update("linkedin")} placeholder="linkedin.com/in/rahul" />
              </div>
            </div>

            <h3 className="text-md font-semibold text-foreground pt-2">Education</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input id="degree" value={data.degree} onChange={update("degree")} placeholder="B.Tech CSE" />
              </div>
              <div>
                <Label htmlFor="college">College</Label>
                <Input id="college" value={data.college} onChange={update("college")} placeholder="IIT Delhi" />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={data.year} onChange={update("year")} placeholder="2024" />
              </div>
            </div>

            <h3 className="text-md font-semibold text-foreground pt-2">Skills</h3>
            <div>
              <Label htmlFor="programmingLanguages">Programming Languages</Label>
              <Input id="programmingLanguages" value={data.programmingLanguages} onChange={update("programmingLanguages")} placeholder="Python, Java, C++, JavaScript" />
            </div>
            <div>
              <Label htmlFor="frameworksLibraries">Frameworks & Libraries</Label>
              <Input id="frameworksLibraries" value={data.frameworksLibraries} onChange={update("frameworksLibraries")} placeholder="React, Node.js, Express, Spring Boot" />
            </div>
            <div>
              <Label htmlFor="toolsPlatforms">Tools & Platforms</Label>
              <Input id="toolsPlatforms" value={data.toolsPlatforms} onChange={update("toolsPlatforms")} placeholder="Docker, AWS, Git, VS Code, Jira" />
            </div>
            <div>
              <Label htmlFor="databases">Databases</Label>
              <Input id="databases" value={data.databases} onChange={update("databases")} placeholder="MySQL, MongoDB, PostgreSQL, Redis" />
            </div>
            <div>
              <Label htmlFor="softSkills">Soft Skills</Label>
              <Input id="softSkills" value={data.softSkills} onChange={update("softSkills")} placeholder="Team Leadership, Communication, Problem Solving" />
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

            <div>
              <Label htmlFor="experience">Experience (one per line, or write paragraphs — AI will format)</Label>
              <Textarea
                id="experience"
                value={data.experience}
                onChange={update("experience")}
                rows={4}
                placeholder={"Intern at XYZ Corp — Built REST APIs using Node.js\nType 'fresher' if no experience — AI will generate relevant content"}
              />
            </div>

            <div>
              <Label htmlFor="projects">Projects (one per line)</Label>
              <Textarea
                id="projects"
                value={data.projects}
                onChange={update("projects")}
                rows={4}
                placeholder={"E-commerce Platform — Full-stack app with React & Node\nChat App — Real-time messaging using WebSocket"}
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certifications (one per line: Name | Organization | Year)</Label>
              <Textarea
                id="certifications"
                value={data.certifications}
                onChange={update("certifications")}
                rows={3}
                placeholder={"AWS Cloud Practitioner | Amazon | 2024\nGoogle Data Analytics | Google | 2023"}
              />
            </div>

            {/* Mobile AI Enhance button */}
            <Button
              onClick={handleGenerateResume}
              disabled={isGenerating}
              variant="secondary"
              className="w-full gap-2 lg:hidden"
              size="lg"
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enhancing with AI...</>
              ) : (
                <><Sparkles className="h-4 w-4" /> AI Enhance Resume</>
              )}
            </Button>
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xl font-bold text-foreground mb-4">Live Preview</h2>
            <ResumePreview data={data} isPaid={isPaid} previewRef={previewRef} />
            <Button
              onClick={handlePayAndDownload}
              className="w-full mt-4 gap-2"
              size="lg"
              disabled={isProcessing}
            >
              {isPaid ? (
                <><Download className="h-4 w-4" /> Download PDF</>
              ) : (
                <><Lock className="h-4 w-4" /> {isProcessing ? "Processing..." : "Unlock & Download PDF – ₹49"}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
