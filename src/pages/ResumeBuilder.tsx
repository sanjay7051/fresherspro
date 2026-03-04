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

const ACTION_VERBS = [
  "Developed", "Engineered", "Designed", "Built", "Implemented",
  "Architected", "Optimized", "Deployed", "Integrated", "Automated",
];

function generateProjectBullets(projectName: string): string[] {
  const name = projectName.trim();
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const v1 = ACTION_VERBS[hash % ACTION_VERBS.length];
  const v2 = ACTION_VERBS[(hash + 3) % ACTION_VERBS.length];
  const v3 = ACTION_VERBS[(hash + 7) % ACTION_VERBS.length];

  return [
    `${v1} ${name} with modern tech stack ensuring scalable architecture and clean code practices.`,
    `${v2} responsive UI components and RESTful API integration for seamless user experience.`,
    `${v3} application for production deployment with optimized performance and error handling.`,
  ];
}

const ResumeBuilder = () => {
  const [isPaid, setIsPaid] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
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
        setItems([...items, input.trim()]);
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
    const capitalizeWords = (text: string) =>
      text.replace(/\b\w/g, (char) => char.toUpperCase());

    const basicSpellFix = (text: string) => {
      return text
        .replace(/java script/gi, "JavaScript")
        .replace(/react js/gi, "React")
        .replace(/node js/gi, "Node.js")
        .replace(/git hub/gi, "GitHub")
        .replace(/aws certified/gi, "AWS Certified")
        .replace(/hackothon/gi, "Hackathon");
    };

    const isFresher =
      form.experience.trim().toLowerCase() === "fresher" ||
      form.experience.trim() === "";

    let enhancedObjective =
      "Detail-Oriented And Highly Motivated Professional With Strong Technical Foundations. Seeking An Opportunity To Contribute Skills, Drive Innovation, And Deliver High-Impact Solutions In A Growth-Oriented Organization.";

    let enhancedExperience = "";

    if (isFresher) {
      enhancedExperience =
        "Fresher With Strong Academic Background And Hands-On Project Experience. Demonstrated Ability To Build Scalable Applications And Collaborate Effectively In Team Environments.";
    } else {
      enhancedExperience =
        "Experienced Professional With Proven Expertise In Delivering High-Quality Software Solutions. Skilled In Problem-Solving, Team Collaboration, And Optimizing Application Performance.";
    }

    const formattedProjects =
      projects.length === 0
        ? [
          "Developed A Full-Stack Web Application Using Modern Technologies And Optimized Performance For Scalability.",
          "Designed And Implemented Responsive UI With Clean Architecture And Best Coding Practices.",
        ]
        : projects.map((p) => capitalizeWords(basicSpellFix(p)));

    setForm({
      ...form,
      objective: capitalizeWords(basicSpellFix(enhancedObjective)),
      experience: capitalizeWords(basicSpellFix(enhancedExperience)),
    });

    setProjects(formattedProjects);

    setCerts(certs.map((c) => capitalizeWords(basicSpellFix(c))));
    setAchievements(
      achievements.map((a) => capitalizeWords(basicSpellFix(a)))
    );
  };

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
                    placeholder="B.Tech CSE"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                  />
                  <Input
                    placeholder="VTU"
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
                <Input
                  value={achievementInput}
                  placeholder="Won 1st Prize in Hackathon 2024"
                  onChange={(e) => setAchievementInput(e.target.value)}
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
                    <div style={{
                      fontSize: "12px",
                      color: "#555",
                      marginTop: "6px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "6px 14px",
                    }}>
                      {form.phone && <span>+91 {form.phone}</span>}
                      {form.email && <span>{form.email}</span>}
                      {form.linkedin && (
                        <span>{form.linkedin}</span>
                      )}
                      {form.github && (
                        <span>{form.github}</span>
                      )}
                    </div>
                  </div>

                  {/* CAREER OBJECTIVE */}
                  {form.objective && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 8px" }}>
                        CAREER OBJECTIVE
                      </h3>
                      <p style={{ fontSize: "12.5px", color: "#444", lineHeight: "1.6", margin: 0 }}>
                        {form.objective}
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
                        {form.experience}
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
                        {education.map((edu, i) => (
                          <p key={i} style={{ fontSize: "12.5px", color: "#444", margin: 0 }}>
                            {edu.degree && <strong>{edu.degree}</strong>}
                            {edu.college && ` – ${edu.college}`}
                            {edu.year && ` (${edu.year})`}
                          </p>
                        ))}
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

                  {/* PROJECTS - With AI-style bullets */}
                  {projects.length > 0 && (
                    <div>
                      <div style={{ borderTop: "1px solid #d1d5db", marginTop: "24px", marginBottom: "16px" }} />
                      <h3 style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "13px", letterSpacing: "1.5px", color: "#222", margin: "0 0 10px" }}>
                        PROJECTS
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {projects.map((proj, i) => {
                          const bullets = generateProjectBullets(proj);
                          return (
                            <div key={i}>
                              <strong style={{ fontSize: "13px", color: "#222" }}>{proj}</strong>
                              <ul style={{ paddingLeft: "16px", margin: "4px 0 0", listStyleType: "disc" }}>
                                {bullets.map((b, bi) => (
                                  <li key={bi} style={{ fontSize: "12px", color: "#555", lineHeight: "1.55", marginBottom: "2px" }}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
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


