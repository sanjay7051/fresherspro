import { useState } from "react";
import html2pdf from "html2pdf.js";
import { Plus, X } from "lucide-react";
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

  const sortedTerms = Object.entries(TECH_TERMS).sort((a, b) => b[0].length - a[0].length);
  for (const [lower, correct] of sortedTerms) {
    const regex = new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(regex, correct);
  }

  return result;
}

function toSentenceCase(text: string): string {
  if (!text.trim()) return text;
  return text.replace(/(^|\.\s+)([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
}

function capitalizeInstitution(name: string): string {
  if (!name.trim()) return name;

  let result = name.replace(/\b\w+/g, (word) => {
    const lower = word.toLowerCase();
    if (["of", "the", "and", "in", "at", "for", "to", "a", "an"].includes(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  result = result.charAt(0).toUpperCase() + result.slice(1);
  return fixSpellingAndCase(result);
}

/* ================= COMPONENT ================= */

const ResumeBuilder = () => {

  const [isPaid, setIsPaid] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [communication, setCommunication] = useState<string[]>([]);

  const [languageInput, setLanguageInput] = useState("");
  const [frameworkInput, setFrameworkInput] = useState("");
  const [toolInput, setToolInput] = useState("");
  const [communicationInput, setCommunicationInput] = useState("");

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


  /* ================= PROJECTS ================= */

  const [projects, setProjects] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");

  const addProject = () => {
    if (projectInput.trim()) {
      setProjects([...projects, projectInput.trim()]);
      setProjectInput("");
    }
  };


  /* ================= CERTIFICATIONS ================= */

  const [certs, setCerts] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");

  const addCert = () => {
    if (certInput.trim()) {
      setCerts([...certs, certInput.trim()]);
      setCertInput("");
    }
  };

  /* ================= ACHIEVEMENTS ================= */

  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementInput, setAchievementInput] = useState("");


  const addAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput("");
    }
  };

  const addSkill = (
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const value = input.trim();

    if (!value) return;

    if (!list.includes(value)) {
      setList([...list, value]);
    }

    setInput("");
  };

  const removeSkill = (
    skill: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(list.filter((s) => s !== skill));
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

  const contactItems: string[] = [];

  if (form.phone) contactItems.push(`+91 ${form.phone}`);
  if (form.email) contactItems.push(form.email);
  if (form.linkedin) contactItems.push(form.linkedin);
  if (form.github) contactItems.push(form.github);
  if (form.location) contactItems.push(form.location);

  const enhanceResume = () => {
    const isFresher =
      form.experience.trim().toLowerCase() === "fresher" ||
      form.experience.trim() === "";

    let enhancedObjective =
      "Detail-oriented and highly motivated professional with strong technical foundations seeking an opportunity to contribute skills and deliver high-impact solutions.";

    let enhancedExperience = "";

    if (isFresher) {
      enhancedExperience =
        "Fresher with strong academic background and hands-on project experience. Demonstrated ability to build scalable applications and collaborate effectively in team environments.";
    } else {
      enhancedExperience =
        "Experienced professional with expertise in delivering high-quality software solutions, optimizing performance, and collaborating effectively with cross-functional teams.";
    }

    setForm({
      ...form,
      objective: enhancedObjective,
      experience: enhancedExperience,
    });
  };

  return (
    <>
      <MainHeader />

      {/* FIXED PAGE SPACING */}
      <div className="min-h-screen bg-gray-50 py-10 px-6 overflow-x-hidden">
        {/* WIDER DESKTOP CONTAINER */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 space-y-10">

            <h2 className="text-3xl font-bold">Resume Details</h2>

            {/* PERSONAL DETAILS */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-base">Full Name *</label>
                <Input
                  className="text-base"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-base">Phone *</label>

                <div
                  className={`flex items-center rounded-lg overflow-hidden h-10 border
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
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="flex-1 px-3 text-base outline-none"
                    placeholder="9876543210"
                  />

                </div>
              </div>

              <div>
                <label className="text-base">Email *</label>
                <Input
                  className="text-base"
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <label className="text-base">LinkedIn</label>
                <Input
                  className="text-base"
                  placeholder="linkedin.com/in/rahul"
                  value={form.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
              </div>

              <div>
                <label className="text-base">GitHub</label>
                <Input
                  className="text-base"
                  placeholder="github.com/rahul"
                  value={form.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                />
              </div>

              <div>
                <label className="text-base">Location</label>
                <Input
                  className="text-base"
                  placeholder="Bangalore, India"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>

            </div>

            {/* OBJECTIVE */}

            <div>
              <h3 className="font-semibold text-lg">Career Objective *</h3>

              <textarea
                rows={2}
                className="w-full border rounded-lg p-3 text-base"
                placeholder="Motivated Computer Science graduate seeking Frontend Developer role."
                value={form.objective}
                onChange={(e) => handleChange("objective", e.target.value)}
              />
            </div>

            {/* EXPERIENCE */}

            <div>
              <h3 className="font-semibold text-lg">Experience</h3>

              <textarea
                rows={2}
                className="w-full border rounded-lg p-3 text-base"
                placeholder="Frontend Developer Intern at ABC Tech..."
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>

            {/* SKILLS */}
            <div className="space-y-6">

              <h3 className="text-lg font-semibold">Skills</h3>

              {/* Languages */}
              <div>

                <p className="font-medium mb-2">Languages</p>

                <div className="flex gap-3">
                  <Input
                    value={languageInput}
                    placeholder="Python"
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(languageInput, setLanguageInput, languages, setLanguages);
                      }
                    }}
                  />

                  <Button size="icon" variant="outline"
                    onClick={() => addSkill(languageInput, setLanguageInput, languages, setLanguages)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {languages.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">

                      {skill}

                      <button
                        onClick={() => removeSkill(skill, languages, setLanguages)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>

                    </div>
                  ))}
                </div>

              </div>

              {/* Frameworks */}
              <div>

                <p className="font-medium mb-2">Frameworks</p>

                <div className="flex gap-3">
                  <Input
                    value={frameworkInput}
                    placeholder="React"
                    onChange={(e) => setFrameworkInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(frameworkInput, setFrameworkInput, frameworks, setFrameworks);
                      }
                    }}
                  />

                  <Button size="icon" variant="outline"
                    onClick={() => addSkill(frameworkInput, setFrameworkInput, frameworks, setFrameworks)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {frameworks.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">

                      {skill}

                      <button
                        onClick={() => removeSkill(skill, frameworks, setFrameworks)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>

                    </div>
                  ))}
                </div>

              </div>

              {/* Tools */}
              <div>

                <p className="font-medium mb-2">Tools</p>

                <div className="flex gap-3">
                  <Input
                    value={toolInput}
                    placeholder="Git"
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(toolInput, setToolInput, tools, setTools);
                      }
                    }}
                  />

                  <Button size="icon" variant="outline"
                    onClick={() => addSkill(toolInput, setToolInput, tools, setTools)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {tools.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">

                      {skill}

                      <button
                        onClick={() => removeSkill(skill, tools, setTools)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>

                    </div>
                  ))}
                </div>

              </div>

              {/* Communication */}
              <div>

                <p className="font-medium mb-2">Communication</p>

                <div className="flex gap-3">
                  <Input
                    value={communicationInput}
                    placeholder="Leadership"
                    onChange={(e) => setCommunicationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill(communicationInput, setCommunicationInput, communication, setCommunication);
                      }
                    }}
                  />

                  <Button size="icon" variant="outline"
                    onClick={() => addSkill(communicationInput, setCommunicationInput, communication, setCommunication)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {communication.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">

                      {skill}

                      <button
                        onClick={() => removeSkill(skill, communication, setCommunication)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X size={14} />
                      </button>

                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* PROJECTS */}
            <div>
              <h3 className="font-semibold text-lg">Projects</h3>

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
                      onClick={() =>
                        setProjects(projects.filter((_, idx) => idx !== i))
                      }
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CERTIFICATIONS */}
            <div>
              <h3 className="font-semibold text-lg">Certifications</h3>

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
                      onClick={() =>
                        setCerts(certs.filter((_, idx) => idx !== i))
                      }
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACHIEVEMENTS */}
            <div>
              <h3 className="font-semibold text-lg">Achievements</h3>

              <div className="flex gap-3">
                <Input
                  value={achievementInput}
                  placeholder="Won 1st Prize in Hackathon 2024"
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAchievement();
                    }
                  }}
                />

                <Button size="sm" onClick={addAchievement}>
                  Add
                </Button>
              </div>

              <ul className="mt-2 text-sm space-y-1">
                {achievements.map((a, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>• {a}</span>

                    <button
                      onClick={() =>
                        setAchievements(
                          achievements.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full ml-2 px-1.5 py-0.5"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full mt-4" onClick={enhanceResume}>
              Generate Resume
            </Button>

          </div>

          {/* PREVIEW */}
          <div className="flex flex-col items-center">

            <div className="print-section bg-gray-100 p-4 sm:p-6 flex justify-center overflow-hidden relative w-full">

              {!isPaid && (
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-200 font-bold rotate-[-30deg] pointer-events-none z-10">
                  FRESHERSPRO PREVIEW
                </div>
              )}

              {/* A4 RESUME */}
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
                <div style={{ textAlign: "center", marginBottom: "16px" }}>

                  <h1
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      margin: 0,
                      color: "#111",
                    }}
                  >
                    {form.name || "YOUR NAME"}
                  </h1>

                  {contactItems.length > 0 && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        marginTop: "6px",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        lineHeight: "1.6",
                      }}
                    >
                      {contactItems.map((item, i) => (
                        <span key={i} style={{ whiteSpace: "nowrap" }}>
                          {i > 0 && (
                            <span style={{ margin: "0 8px", color: "#999" }}>
                              |
                            </span>
                          )}
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* PAYMENT */}
            <div className="w-full mt-6 px-4" style={{ maxWidth: "794px" }}>

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

export default ResumeBuilder;