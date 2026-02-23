import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Download, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import html2pdf from "html2pdf.js";

interface ResumeData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  degree: string;
  college: string;
  year: string;
  skills: string;
  experience: string;
  projects: string;
  certifications: string;
  careerObjective: string;
}

const emptyResume: ResumeData = {
  fullName: "",
  phone: "",
  email: "",
  linkedin: "",
  degree: "",
  college: "",
  year: "",
  skills: "",
  experience: "",
  projects: "",
  certifications: "",
  careerObjective: "",
};

const RAZORPAY_KEY = "rzp_test_XXXXXXXXXXXXXXXXX"; // Replace with your Razorpay test key
const PRICE_AMOUNT = 4900; // ₹49 in paise

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ResumePreview = ({ data, isPaid, previewRef }: { data: ResumeData; isPaid: boolean; previewRef: React.RefObject<HTMLDivElement> }) => {
  const skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      ref={previewRef}
      className="relative no-select bg-card border border-border rounded-lg p-8 min-h-[700px] shadow-sm text-sm"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Watermark - hidden when paid */}
      {!isPaid && <div className="watermark" />}

      {/* Header */}
      <div className="border-b-2 border-primary pb-4 mb-4">
        <h2 className="text-2xl font-bold text-foreground">
          {data.fullName || "Your Full Name"}
        </h2>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
        </div>
      </div>

      {/* Career Objective */}
      {data.careerObjective && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Career Objective
          </h3>
          <p className="text-foreground leading-relaxed text-xs">{data.careerObjective}</p>
        </div>
      )}

      {/* Education */}
      {(data.degree || data.college) && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Education
          </h3>
          <p className="text-foreground text-xs font-semibold">{data.degree}</p>
          <p className="text-muted-foreground text-xs">
            {data.college} {data.year && `• ${data.year}`}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded bg-accent px-2 py-0.5 text-xs text-accent-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Experience
          </h3>
          <p className="whitespace-pre-line text-foreground text-xs leading-relaxed">
            {data.experience}
          </p>
        </div>
      )}

      {/* Projects */}
      {data.projects && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Projects
          </h3>
          <p className="whitespace-pre-line text-foreground text-xs leading-relaxed">
            {data.projects}
          </p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            Certifications
          </h3>
          <p className="whitespace-pre-line text-foreground text-xs leading-relaxed">
            {data.certifications}
          </p>
        </div>
      )}
    </div>
  );
};

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [isPaid, setIsPaid] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (field: keyof ResumeData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

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

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: PRICE_AMOUNT,
      currency: "INR",
      name: "FreshersPro",
      description: "Unlock Watermark-Free Resume PDF",
      handler: () => {
        setIsPaid(true);
        toast.success("Payment successful! Downloading your resume...");
        setTimeout(() => handleDownloadPDF(), 500);
      },
      prefill: {
        name: data.fullName,
        email: data.email,
        contact: data.phone,
      },
      theme: { color: "#0d9488" },
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled. Watermark remains.");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", () => {
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
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
            <Button size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Generate Resume
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

            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input id="skills" value={data.skills} onChange={update("skills")} placeholder="Python, React, SQL, Machine Learning" />
            </div>

            <div>
              <Label htmlFor="careerObjective">Career Objective</Label>
              <Textarea
                id="careerObjective"
                value={data.careerObjective}
                onChange={update("careerObjective")}
                rows={3}
                placeholder="A motivated computer science graduate seeking..."
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                value={data.experience}
                onChange={update("experience")}
                rows={4}
                placeholder="Intern at XYZ Corp — Built REST APIs..."
              />
            </div>

            <div>
              <Label htmlFor="projects">Projects</Label>
              <Textarea
                id="projects"
                value={data.projects}
                onChange={update("projects")}
                rows={4}
                placeholder="E-commerce Platform — Built a full-stack..."
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certifications (optional)</Label>
              <Textarea
                id="certifications"
                value={data.certifications}
                onChange={update("certifications")}
                rows={2}
                placeholder="AWS Cloud Practitioner, Google Data Analytics"
              />
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="text-xl font-bold text-foreground mb-4">Live Preview</h2>
            <ResumePreview data={data} isPaid={isPaid} previewRef={previewRef} />
            <Button
              onClick={handlePayAndDownload}
              className="w-full mt-4 gap-2"
              size="lg"
            >
              {isPaid ? (
                <><Download className="h-4 w-4" /> Download PDF</>
              ) : (
                <><Lock className="h-4 w-4" /> Unlock & Download PDF – ₹49</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
