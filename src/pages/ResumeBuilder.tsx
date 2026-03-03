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

const ResumeBuilder = () => {
  const [isPaid, setIsPaid] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
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

    return { items, input, setInput, addItem };
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

      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">

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
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                        >
                          {item}
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

              <ul className="mt-2 text-sm">
                {projects.map((proj, i) => (
                  <li key={i}>• {proj}</li>
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

              <ul className="mt-2 text-sm">
                {certs.map((c, i) => (
                  <li key={i}>• {c}</li>
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

              <ul className="mt-2 text-sm">
                {achievements.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>

            <Button className="w-full" onClick={enhanceResume}>
              Generate Resume
            </Button>
          </div>

          {/* ================= PREVIEW ================= */}
          {/* ================= PREVIEW ================= */}
          <div className="print-section bg-white p-10 relative">
            {!isPaid && (
              <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-200 font-bold rotate-[-30deg] pointer-events-none">
                FRESHERSPRO PREVIEW
              </div>
            )}

            {/* Resume Content */}
            <div
              id="resume-preview"
              className="bg-white mx-auto shadow-lg"
              style={{
                width: "100%",
                maxWidth: "794px",
                minHeight: "1123px",
                padding: "40px",
              }}
            >

            </div>
            <div className="flex-1 space-y-6">

              <div>
                <h1 className="text-3xl font-bold">
                  {form.name || "Your Name"}
                </h1>

                <p className="text-sm text-gray-600 mt-1">
                  {form.email || "your@email.com"}{" "}
                  {form.phone && ` • +91 ${form.phone}`}
                </p>

                <hr className="my-4" />
              </div>

              {/* OBJECTIVE */}
              {form.objective && (
                <div>
                  <h3 className="font-semibold uppercase text-sm tracking-wide">
                    Career Objective
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {form.objective}
                  </p>
                </div>
              )}

              {/* EXPERIENCE */}
              {form.experience && (
                <div>
                  <h3 className="font-semibold uppercase text-sm tracking-wide">
                    Experience
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {form.experience}
                  </p>
                </div>
              )}

              {/* EDUCATION */}
              {education.some(
                (edu) => edu.degree || edu.college || edu.year
              ) && (
                  <div>
                    <h3 className="font-semibold uppercase text-sm tracking-wide">
                      Education
                    </h3>
                    <div className="mt-2 space-y-1">
                      {education.map((edu, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          {edu.degree && <strong>{edu.degree}</strong>}
                          {edu.college && ` – ${edu.college}`}
                          {edu.year && ` (${edu.year})`}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              {/* SKILLS */}
              {(languages.items.length > 0 ||
                frameworks.items.length > 0 ||
                libraries.items.length > 0 ||
                tools.items.length > 0 ||
                platforms.items.length > 0) && (
                  <div>
                    <h3 className="font-semibold uppercase text-sm tracking-wide">
                      Skills
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-gray-700">
                      {languages.items.length > 0 && (
                        <p>
                          <strong>Languages:</strong>{" "}
                          {languages.items.join(", ")}
                        </p>
                      )}

                      {frameworks.items.length > 0 && (
                        <p>
                          <strong>Frameworks:</strong>{" "}
                          {frameworks.items.join(", ")}
                        </p>
                      )}

                      {libraries.items.length > 0 && (
                        <p>
                          <strong>Libraries:</strong>{" "}
                          {libraries.items.join(", ")}
                        </p>
                      )}

                      {tools.items.length > 0 && (
                        <p>
                          <strong>Tools:</strong>{" "}
                          {tools.items.join(", ")}
                        </p>
                      )}

                      {platforms.items.length > 0 && (
                        <p>
                          <strong>Platforms:</strong>{" "}
                          {platforms.items.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                )}


              {/* PROJECTS */}
              {projects.length > 0 && (
                <div>
                  <h3 className="font-semibold uppercase text-sm tracking-wide">
                    Projects
                  </h3>
                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    {projects.map((proj, i) => (
                      <li key={i}>• {proj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CERTIFICATIONS */}
              {certs.length > 0 && (
                <div>
                  <h3 className="font-semibold uppercase text-sm tracking-wide">
                    Certifications
                  </h3>
                  <ul className="mt-2 text-sm text-gray-700 space-y-1">
                    {certs.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS */}
            {achievements.length > 0 && (
              <div>
                <h3 className="font-semibold uppercase text-sm tracking-wide">
                  Achievements
                </h3>
                <ul className="mt-2 text-sm text-gray-700 space-y-1">
                  {achievements.map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment Section */}
            <div className="mt-10 border-t pt-6">
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


