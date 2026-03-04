import { useState } from "react";
import html2pdf from "html2pdf.js";
import { Trash2 } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Education {
  degree: string;
  college: string;
  year: string;
}

/* ================= SPELLING & FORMATTING HELPERS ================= */

const TECH_TERMS: Record<string, string> = {
  "javascript": "JavaScript", "typescript": "TypeScript", "python": "Python",
  "java": "Java", "react": "React", "reactjs": "React", "react js": "React",
  "nodejs": "Node.js", "node js": "Node.js", "node.js": "Node.js",
  "nextjs": "Next.js", "next js": "Next.js", "next.js": "Next.js",
  "vuejs": "Vue.js", "vue js": "Vue.js", "angular": "Angular",
  "firebase": "Firebase", "mongodb": "MongoDB", "mysql": "MySQL",
  "postgresql": "PostgreSQL", "postgres": "PostgreSQL",
  "github": "GitHub", "git hub": "GitHub", "gitlab": "GitLab",
  "docker": "Docker", "kubernetes": "Kubernetes", "aws": "AWS",
  "azure": "Azure", "gcp": "GCP", "html": "HTML", "css": "CSS",
  "sass": "SASS", "tailwind": "Tailwind CSS", "bootstrap": "Bootstrap",
  "redux": "Redux", "graphql": "GraphQL", "restful": "RESTful",
  "sql": "SQL", "nosql": "NoSQL", "linux": "Linux", "django": "Django",
  "flask": "Flask", "spring boot": "Spring Boot", "springboot": "Spring Boot",
  "express": "Express.js", "expressjs": "Express.js",
  "flutter": "Flutter", "dart": "Dart", "kotlin": "Kotlin", "swift": "Swift",
  "tensorflow": "TensorFlow", "pytorch": "PyTorch", "opencv": "OpenCV",
  "hadoop": "Hadoop", "spark": "Spark", "kafka": "Kafka",
  "jenkins": "Jenkins", "terraform": "Terraform", "ansible": "Ansible",
  "figma": "Figma", "jira": "Jira", "vs code": "VS Code", "vscode": "VS Code",
  "api": "API", "apis": "APIs", "ui": "UI", "ux": "UX",
  "mern": "MERN", "mean": "MEAN", "devops": "DevOps",
  "hackothon": "Hackathon", "hackathon": "Hackathon",
  "aws certified": "AWS Certified", "c++": "C++", "c#": "C#",
  "php": "PHP", "ruby": "Ruby", "golang": "Go", "rust": "Rust",
  "sslc": "SSLC", "puc": "PUC", "cbse": "CBSE", "icse": "ICSE",
};

function fixSpellingAndCase(text: string): string {
  if (!text.trim()) return text;
  let result = text;

  // Fix tech terms (case-insensitive replacement)
  const sortedTerms = Object.entries(TECH_TERMS).sort((a, b) => b[0].length - a[0].length);
  for (const [lower, correct] of sortedTerms) {
    const regex = new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, correct);
  }

  return result;
}

function toSentenceCase(text: string): string {
  if (!text.trim()) return text;
  // Split into sentences, capitalize first letter of each
  return text.replace(/(^|\.\s+)([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
}

function capitalizeInstitution(name: string): string {
  if (!name.trim()) return name;
  // Capitalize each word, fix tech terms
  let result = name.replace(/\b\w+/g, (word) => {
    const lower = word.toLowerCase();
    if (["of", "the", "and", "in", "at", "for", "to", "a", "an"].includes(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  // Fix first word always capitalized
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return fixSpellingAndCase(result);
}

/* ================= EDUCATION FORMATTING ================= */

const EDUCATION_MAP: Record<string, string> = {
  "10th": "Secondary School (SSLC)",
  "10": "Secondary School (SSLC)",
  "sslc": "Secondary School (SSLC)",
  "10th standard": "Secondary School (SSLC)",
  "10th std": "Secondary School (SSLC)",
  "xth": "Secondary School (SSLC)",
  "x": "Secondary School (SSLC)",
  "high school": "Secondary School (SSLC)",
  "highschool": "Secondary School (SSLC)",
  "12th": "Higher Secondary (PUC/HSC)",
  "12": "Higher Secondary (PUC/HSC)",
  "12th standard": "Higher Secondary (PUC/HSC)",
  "12th std": "Higher Secondary (PUC/HSC)",
  "xiith": "Higher Secondary (PUC/HSC)",
  "xii": "Higher Secondary (PUC/HSC)",
  "hsc": "Higher Secondary (HSC)",
  "2nd puc": "Pre-University Course (PUC)",
  "2nd pu": "Pre-University Course (PUC)",
  "puc": "Pre-University Course (PUC)",
  "pu": "Pre-University Course (PUC)",
  "1st puc": "Pre-University Course (1st PUC)",
  "intermediate": "Intermediate",
  "diploma": "Diploma",
};

function formatDegree(degree: string): string {
  const trimmed = degree.trim();
  const lower = trimmed.toLowerCase();
  if (EDUCATION_MAP[lower]) return EDUCATION_MAP[lower];
  // Already formal (B.Tech, M.Sc, etc.) — just fix spelling
  return fixSpellingAndCase(trimmed);
}

/* ================= PROJECT DESCRIPTION GENERATOR ================= */

const PROJECT_TEMPLATES = [
  (name: string) => `Built a scalable ${name} application using modern web technologies with optimized architecture, responsive UI, and seamless API integrations for improved user experience.`,
  (name: string) => `Developed ${name} with clean architecture and efficient data handling, delivering a production-ready solution with intuitive design and robust performance.`,
  (name: string) => `Engineered ${name} leveraging industry-standard frameworks and best practices, ensuring scalable infrastructure and streamlined workflows for end users.`,
  (name: string) => `Designed and implemented ${name} with focus on real-time data processing, clean code architecture, and optimized backend services for enhanced reliability.`,
  (name: string) => `Created ${name} featuring modern UI components, efficient state management, and RESTful API integration to deliver a seamless and performant application.`,
  (name: string) => `Architected ${name} with responsive design principles and modular codebase, enabling maintainable development and superior cross-platform compatibility.`,
];

function generateProjectDescription(projectName: string): string {
  const name = projectName.trim();
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const template = PROJECT_TEMPLATES[hash % PROJECT_TEMPLATES.length];
  return template(name);
}

/* ================= COMPONENT ================= */

const ResumeBuilder = () => {
  const [isPaid, setIsPaid] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
    objective: "",
    experience: "",
  });

  const isPhoneValid = form.phone.length === 10;

  const handleChange = (field: string, value: string) => {
    if (field === "phone") {
      const numbers = value.replace(/\D/g, "");
      if (numbers.length <= 10) {
        setForm({ ...form, phone: numbers });
      }
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  /* ================= EDUCATION ================= */

  const [education, setEducation] = useState<Education[]>([
    { degree: "", college: "", year: "" },
  ]);

  const addEducation = () => {
    setEducation([...education, { degree: "", college: "", year: "" }]);
  };

  const deleteEducation = (index: number) => {
    if (education.length === 1) return;
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...education];

    if (field === "year") {
      const numbers = value.replace(/\D/g, "");
      if (numbers.length <= 4) {
        updated[index][field] = numbers;
      }
    } else {
      updated[index][field] = value;
    }

    setEducation(updated);
  };

  /* ================= SKILLS ================= */

  const useSkill = () => {
    const [items, setItems] = useState<string[]>([]);
    const [input, setInput] = useState("");

    const addItem = () => {
      if (input.trim()) {
        setItems([...items, fixSpellingAndCase(input.trim())]);
        setInput("");
      }
    };

    return { items, setItems, input, setInput, addItem };
  };

  const languages = useSkill();
  const frameworks = useSkill();
  const libraries = useSkill();
  const tools = useSkill();
  const platforms = useSkill();

  /* ================= PROJECTS ================= */

  const [projects, setProjects] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");

  const addProject = () => {
    if (projectInput.trim()) {
      setProjects([...projects, fixSpellingAndCase(projectInput.trim())]);
      setProjectInput("");
    }
  };

  /* ================= CERTIFICATIONS ================= */

  const [certs, setCerts] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");

  const addCert = () => {
    if (certInput.trim()) {
      setCerts([...certs, fixSpellingAndCase(certInput.trim())]);
      setCertInput("");
    }
  };

  /* ================= ACHIEVEMENTS ================= */

  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, fixSpellingAndCase(achievementInput.trim())]);
      setAchievementInput("");
    }
  };

  const handleDownload = () => {
    if (!isPaid) return;

    const element = document.getElementById("resume-preview");

    const opt = {
      margin: 0,
      filename: `${form.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "px",
        format: [794, 1123],
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  const enhanceResume = () => {
    const isFresher =
      form.experience.trim().toLowerCase() === "fresher" ||
      form.experience.trim() === "";

    let enhancedObjective =
      "Detail-oriented and highly motivated professional with strong technical foundations. Seeking an opportunity to contribute skills, drive innovation, and deliver high-impact solutions in a growth-oriented organization.";

    let enhancedExperience = "";

    if (isFresher) {
      enhancedExperience =
        "Fresher with strong academic background and hands-on project experience. Demonstrated ability to build scalable applications and collaborate effectively in team environments.";
    } else {
      enhancedExperience =
        "Experienced professional with proven expertise in delivering high-quality software solutions. Skilled in problem-solving, team collaboration, and optimizing application performance.";
    }

    setForm({
      ...form,
      objective: enhancedObjective,
      experience: enhancedExperience,
    });

    setProjects(projects.map((p) => fixSpellingAndCase(p)));
    setCerts(certs.map((c) => fixSpellingAndCase(c)));
    setAchievements(achievements.map((a) => fixSpellingAndCase(a)));
  };

  /* ================= PREVIEW HELPERS ================= */

  const contactItems: string[] = [];
  if (form.phone) contactItems.push(`+91 ${form.phone}`);
  if (form.email) contactItems.push(form.email);
  if (form.linkedin) contactItems.push(form.linkedin);
  if (form.github) contactItems.push(form.github);
  if (form.location) contactItems.push(form.location);

  return (
    <>
      <MainHeader />

      <div className="min-h-screen bg-gray-50 py-8 px-4 overflow-x-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 space-y-8">

            <h2 className="text-2xl font-bold">Resume Details</h2>

            {/* PERSONAL DETAILS */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label>Full Name *</label>
                <Input
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label>Phone *</label>
                <div
                  className={`flex items-center rounded-lg overflow-hidden h-9 border
                  ${form.phone.length === 0
                      ? "border-gray-300"
                      : isPhoneValid
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                >
                  <div className="px-3 bg-gray-100 text-sm border-r">
                    +91
                  </div>
                  <input
                    type="text"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    className="flex-1 px-3 text-sm outline-none"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label>Email *</label>
                <Input
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <label>LinkedIn</label>
                <Input
                  placeholder="linkedin.com/in/rahul"
                  value={form.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
              </div>

              <div>
                <label>GitHub</label>
                <Input
                  placeholder="github.com/rahul"
                  value={form.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                />
              </div>

              <div>
                <label>Location</label>
                <Input
                  placeholder="Bangalore, India"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
            </div>

            {/* OBJECTIVE */}
            <div>
              <h3 className="font-semibold">Career Objective *</h3>
              <textarea
                rows={2}
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Motivated Computer Science graduate seeking Frontend Developer role."
                value={form.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
              />
            </div>

            {/* EDUCATION */}
            <div>
              <h3 className="font-semibold">Education *</h3>

              {education.map((edu, index) => (
                <div key={index} className="flex gap-4 mb-3 items-center">
                  <Input
                    placeholder="B.Tech CSE / 10th / PUC"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Institution Name"
                    value={edu.college}
                    onChange={(e) =>
                      handleEducationChange(index, "college", e.target.value)
                    }
                  />
                  <Input
                    placeholder="2024"
                    value={edu.year}
                    onChange={(e) =>
                      handleEducationChange(index, "year", e.target.value)
                    }
                  />

                  <button onClick={() => deleteEducation(index)}>
                    <Trash2 size={22} className="text-red-500" />
                  </button>
                </div>
              ))}

              <Button size="sm" onClick={addEducation}>
                + Add Education
              </Button>
            </div>

            {/* SKILLS */}
            <div>
              <h3 className="font-semibold">Skills</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Languages", state: languages, ex: "JavaScript, Python, Java" },
                  { title: "Frameworks", state: frameworks, ex: "React, Next.js, Spring Boot" },
                  { title: "Libraries", state: libraries, ex: "Redux, Axios, jQuery" },
                  { title: "Tools", state: tools, ex: "Git, Docker, VS Code" },
                  { title: "Platforms", state: platforms, ex: "AWS, Azure, Firebase" },
                ].map((section) => (
                  <div key={section.title}>
                    <label className="text-sm">{section.title}</label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder={` ${section.ex}`}
                        value={section.state.input}
                        onChange={(e) => section.state.setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            section.state.addItem();
                          }
                        }}
                      />
                      <Button size="sm" onClick={section.state.addItem}>
                        +
                      </Button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {section.state.items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {item}
                          <button
                            onClick={() => {
                              section.state.setItems(section.state.items.filter((_, idx) => idx !== i));
                            }}
                            className="ml-1.5 text-red-500 hover:text-red-700 font-bold"
                          >×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <h3 className="font-semibold">Experience</h3>
              <textarea
                rows={2}
                className="w-full border rounded-lg p-2 text-sm"
                placeholder="Frontend Developer Intern at ABC Tech..."
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>

            {/* PROJECTS */}
            <div>
              <h3 className="font-semibold">Projects</h3>
          <div className="flex gap-3">
                <Input
                  value={projectInput}
                  placeholder="E-commerce Website using MERN"
                  onChange={(e) => setProjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addProject();
                    }
                  }}
                />
                <Button size="sm" onClick={addProject}>
                  Add
                </Button>
              </div>

              <ul className="mt-2 text-sm space-y-1">
                {projects.map((proj, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {proj}</span>
                    <button
                      onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5 cursor-pointer"
                    >✕</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CERTIFICATIONS */}
            <div>
              <h3 className="font-semibold">Certifications</h3>
              <div className="flex gap-3">
                <Input
                  value={certInput}
                  placeholder="AWS Certified Cloud Practitioner"
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCert();
                    }
                  }}
                />
                <Button size="sm" onClick={addCert}>
                  Add
                </Button>
              </div>

              <ul className="mt-2 text-sm space-y-1">
                {certs.map((c, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {c}</span>
                    <button
                      onClick={() => setCerts(certs.filter((_, idx) => idx !== i))}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5 cursor-pointer"
                    >✕</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACHIEVEMENTS */}
            <div>
              <h3 className="font-semibold">Achievements</h3>
              <div className="flex gap-3">
                <input
                  value={achievementInput}
                  placeholder="Won 1st Prize in Hackathon 2024"
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAchievement();
                    }
                  }}
                />
                <Button size="sm" onClick={addAchievement}>
                  Add
                </Button>
                <div className="flex flex-wrap gap-2 mt-2">
                  {achievements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 px-2 py-1 rounded text-sm"
                    >
                      {item}
                      <button
                        className="ml-2 text-red-500"
                        onClick={() =>
                          setAchievements(achievements.filter((_, i) => i !== index))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <ul className="mt-2 text-sm space-y-1">
                {achievements.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {a}</span>
                    <button
                      onClick={() => setAchievements(achievements.filter((_, idx) => idx !== i))}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5 cursor-pointer"
                    >✕</button>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full" onClick={enhanceResume}>
              Generate Resume
            </Button>
          </div>

          {/* ================= PREVIEW ================= */}
          <div className="flex flex-col items-center">
            <div className="print-section bg-gray-100 p-2 sm:p-6 flex justify-center overflow-hidden relative w-full">

              {!isPaid && (
                <div className="absolute inset-0 flex items-center justify-center text-2xl sm:text-4xl text-gray-200 font-bold rotate-[-30deg] pointer-events-none z-10">
                  FRESHERSPRO PREVIEW
                </div>
              )}

              {/* A4 Resume Container */}
              <div
                id="resume-preview"
                className="bg-white shadow-lg relative z-0 w-full"
                style={{
                  maxWidth: "794px",
                  minHeight: "1123px",
                  padding: "clamp(16px, 4vw, 40px)",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  {/* HEADER - Centered */}
                  <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <h1 style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      margin: 0,
                      color: "#111",
                    }}>
                      {form.name || "YOUR NAME"}
                    </h1>
                    {contactItems.length > 0 && (
                      <div style={{
                        fontSize: "12px",
                        color: "#555",
                        marginTop: "6px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "0",
                        lineHeight: "1.6",
                      }}>
                        {contactItems.map((item, i) => (
                          <span key={i} style={{ whiteSpace: "nowrap" }}>
                            {i > 0 && <span style={{ margin: "0 8px", color: "#999" }}>|</span>}
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CAREER OBJECTIVE */}
                  {form.objective && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        CAREER OBJECTIVE
                      </h3>
                      <p style={{ fontSize: "12.5px", color: "#444", lineHeight: "1.6", margin: 0 }}>
                        {toSentenceCase(fixSpellingAndCase(form.objective))}
                      </p>
                    </div>
                  )}

                  {/* EXPERIENCE */}
                  {form.experience && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        EXPERIENCE
                      </h3>
                      <p style={{ fontSize: "12.5px", color: "#444", lineHeight: "1.6", margin: 0 }}>
                        {toSentenceCase(fixSpellingAndCase(form.experience))}
                      </p>
                    </div>
                  )}

                  {/* EDUCATION */}
                  {education.some((edu) => edu.degree || edu.college || edu.year) && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        EDUCATION
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {education.map((edu, i) => {
                          const formattedDegree = formatDegree(edu.degree);
                          const formattedCollege = capitalizeInstitution(edu.college);
                          return (
                            <p key={i} style={{ fontSize: "12.5px", color: "#444", margin: 0 }}>
                              {formattedDegree && <strong>{formattedDegree}</strong>}
                              {formattedCollege && ` — ${formattedCollege}`}
                              {edu.year && ` (${edu.year})`}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SKILLS - Badge style */}
                  {(languages.items.length > 0 ||
                    frameworks.items.length > 0 ||
                    libraries.items.length > 0 ||
                    tools.items.length > 0 ||
                    platforms.items.length > 0) && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 10px" }}>
                        SKILLS
                      </h3>
                      {[
                        { label: "Languages", items: languages.items },
                        { label: "Frameworks", items: frameworks.items },
                        { label: "Libraries", items: libraries.items },
                        { label: "Tools", items: tools.items },
                        { label: "Platforms", items: platforms.items },
                      ].filter(s => s.items.length > 0).map((section) => (
                        <div key={section.label} style={{ marginBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#333" }}>{section.label}: </span>
                          <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "4px", verticalAlign: "middle" }}>
                            {section.items.map((item, i) => (
                              <span key={i} style={{
                                display: "inline-block",
                                background: "#f3f4f6",
                                color: "#374151",
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: 500,
                              }}>
                                {item}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* PROJECTS - Professional paragraph format */}
                  {projects.length > 0 && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 10px" }}>
                        PROJECTS
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {projects.map((proj, i) => (
                          <div key={i}>
                            <strong style={{ fontSize: "13px", color: "#222" }}>{proj}</strong>
                            <p style={{ fontSize: "12px", color: "#555", lineHeight: "1.6", margin: "3px 0 0", textAlign: "justify" }}>
                              {generateProjectDescription(proj)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CERTIFICATIONS */}
                  {certs.length > 0 && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        CERTIFICATIONS
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                        {certs.map((c, i) => (
                          <li key={i} style={{ fontSize: "12.5px", color: "#444", marginBottom: "3px" }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ACHIEVEMENTS */}
                  {achievements.length > 0 && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        ACHIEVEMENTS
                      </h3>
                      <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                        {achievements.map((a, i) => (
                          <li key={i} style={{ fontSize: "12.5px", color: "#444", marginBottom: "3px" }}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Section - Always below preview */}
            <div className="w-full mt-4 sm:mt-5 lg:mt-6 px-2 sm:px-6" style={{ maxWidth: "794px" }}>
              {!isPaid ? (
                <Button
                  onClick={() => setIsPaid(true)}
                  className="w-full"
                >
                  Pay ₹49 to Unlock PDF
                </Button>
              ) : (
                <Button
                  onClick={handleDownload}
                  className="w-full"
                >
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// 📌 THIS LINE IS REQUIRED 👇
export default ResumeBuilder;
