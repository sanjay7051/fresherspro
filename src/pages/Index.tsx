import { Link } from "react-router-dom";
import { FileText, BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-office.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "90vh" }}
    >
      <img
        src={heroImage}
        alt="Professional office workspace"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1
          className="font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", lineHeight: 1.15 }}
        >
          Build a Resume That Gets You Hired.
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl font-medium text-white/80"
          style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
        >
          Professional. ATS-Optimized. Recruiter-Approved.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/builder">
            <Button
              size="lg"
              className="rounded-lg px-8 py-6 text-base font-semibold"
              style={{ backgroundColor: "#1E3A8A", color: "#fff" }}
            >
              Create My Resume
            </Button>
          </Link>
          <Link to="/builder">
            <Button
              size="lg"
              className="rounded-lg border border-white/60 bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white/10"
            >
              View Sample Resume
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      step: "1",
      title: "Fill Your Details",
      description: "Enter your education, skills, experience and projects in a simple form.",
    },
    {
      icon: BarChart3,
      step: "2",
      title: "AI Enhances Your Resume",
      description: "Our AI rewrites content professionally and checks ATS compatibility.",
    },
    {
      icon: Download,
      step: "3",
      title: "Download & Apply",
      description: "Get a clean, ATS-friendly PDF resume ready to send to employers.",
    },
  ];

  return (
    <section className="section-alt py-20" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Three simple steps to your professional resume
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative rounded-xl bg-card p-8 shadow-sm border border-border text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="absolute top-4 right-4 text-5xl font-extrabold text-muted/60">
                {s.step}
              </span>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section className="py-20 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
          Simple Pricing
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
          Preview for free, pay only when you're satisfied
        </p>
        <div className="mt-14 mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="text-lg font-semibold text-foreground">Free</h3>
            <p className="mt-1 text-3xl font-extrabold text-foreground">₹0</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["Resume preview with watermark", "ATS score analysis", "Improvement suggestions", "Unlimited previews"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/builder">
              <Button variant="outline" className="mt-8 w-full">
                Get Started Free
              </Button>
            </Link>
          </div>
          {/* Paid */}
          <div className="relative rounded-xl border-2 border-primary bg-card p-8">
            <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
              Most Popular
            </span>
            <h3 className="text-lg font-semibold text-foreground">Pro</h3>
            <p className="mt-1 text-3xl font-extrabold text-foreground">
              ₹49 <span className="text-sm font-normal text-muted-foreground">/ resume</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                "Everything in Free",
                "Watermark-free PDF download",
                "ATS-optimized version",
                "Professional formatting",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/builder">
              <Button className="mt-8 w-full">
                Build My Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-border bg-background py-10">
    <div className="container mx-auto px-4 text-center">
      <p className="text-lg font-bold text-foreground">FreshersPro</p>
      <p className="mt-1 text-sm text-muted-foreground">
        AI-powered Resume Builder for Indian Students & Freshers
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FreshersPro. All rights reserved.
      </p>
    </div>
  </footer>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-primary">
            FreshersPro
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <Link to="/ats" className="hover:text-foreground transition-colors">ATS Checker</Link>
          </nav>
          <Link to="/builder">
            <Button size="sm">Build Resume</Button>
          </Link>
        </div>
      </header>

      <main>
        <HeroSection />
        <HowItWorks />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
