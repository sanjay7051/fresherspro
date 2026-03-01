import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type {
  ResumeData,
  ExperienceEntry,
  ProjectEntry,
  EducationEntry,
} from "@/types/resume";
import { generateId } from "@/types/resume";

/* ─── Shared Styles ─── */
const inputClass =
  "h-11 rounded-lg border-input bg-background text-foreground text-[14px] px-3 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring/60 focus-visible:ring-offset-0 transition-colors placeholder:text-muted-foreground/50";
const textareaClass =
  "min-h-[120px] rounded-lg border-input bg-background text-foreground text-[14px] px-3 py-3 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring/60 focus-visible:ring-offset-0 transition-colors placeholder:text-muted-foreground/50";

/* ─── Sub-components (stable references) ─── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground border-b border-border pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-foreground">{label}</Label>
    {children}
  </div>
);

/* ─── Tag Input for arrays ─── */
const TagInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder: string;
}) => {
  const [draft, setDraft] = React.useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setDraft("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <Button type="button" variant="outline" size="icon" onClick={add} className="shrink-0 h-11 w-11">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2.5 py-1 text-xs"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Form ─── */
interface ResumeFormV2Props {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeFormV2 = ({ data, setData }: ResumeFormV2Props) => {
  const updateField = useCallback(
    (field: keyof ResumeData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [setData]
  );

  const updateArray = useCallback(
    (field: keyof ResumeData) => (val: string[]) => {
      setData((prev) => ({ ...prev, [field]: val }));
    },
    [setData]
  );

  /* Experience */
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: generateId(), title: "", company: "", duration: "", bullets: [""] }],
    }));
  };

  const updateExperience = (id: string, updates: Partial<ExperienceEntry>) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  };

  /* Projects */
  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: generateId(), name: "", description: "", bullets: [""] }],
    }));
  };

  const updateProject = (id: string, updates: Partial<ProjectEntry>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  };

  /* Education */
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { id: generateId(), degree: "", institution: "", year: "" }],
    }));
  };

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  };

  return (
    <div className="space-y-7">
      {/* Personal */}
      <Section title="Personal Details">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Full Name">
            <Input value={data.fullName} onChange={updateField("fullName")} placeholder="John Doe" className={inputClass} />
          </Field>
          <Field label="Job Title">
            <Input value={data.jobTitle} onChange={updateField("jobTitle")} placeholder="Software Engineer" className={inputClass} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Phone">
            <Input value={data.phone} onChange={updateField("phone")} placeholder="+91 98765 43210" className={inputClass} />
          </Field>
          <Field label="Email">
            <Input type="email" value={data.email} onChange={updateField("email")} placeholder="john@example.com" className={inputClass} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="LinkedIn">
            <Input value={data.linkedin} onChange={updateField("linkedin")} placeholder="linkedin.com/in/johndoe" className={inputClass} />
          </Field>
          <Field label="Location">
            <Input value={data.location} onChange={updateField("location")} placeholder="Mumbai, India" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Summary */}
      <Section title="Professional Summary">
        <Textarea
          value={data.summary}
          onChange={updateField("summary")}
          placeholder="Results-driven software engineer with 3+ years of experience..."
          className={textareaClass}
        />
      </Section>

      {/* Experience */}
      <Section title="Experience">
        {data.experience.map((exp) => (
          <div key={exp.id} className="rounded-lg border border-border p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                placeholder="Job Title"
                className={inputClass}
              />
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Company"
                className={inputClass}
              />
            </div>
            <Input
              value={exp.duration}
              onChange={(e) => updateExperience(exp.id, { duration: e.target.value })}
              placeholder="Jan 2022 – Present"
              className={inputClass}
            />
            <Textarea
              value={exp.bullets.join("\n")}
              onChange={(e) => updateExperience(exp.id, { bullets: e.target.value.split("\n") })}
              placeholder="Led team of 5 engineers&#10;Reduced API response time by 40%"
              className={textareaClass + " min-h-[100px]"}
            />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addExperience} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {data.projects.map((proj) => (
          <div key={proj.id} className="rounded-lg border border-border p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeProject(proj.id)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Input
              value={proj.name}
              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              placeholder="Project Name"
              className={inputClass}
            />
            <Input
              value={proj.description}
              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
              placeholder="Short description"
              className={inputClass}
            />
            <Textarea
              value={proj.bullets.join("\n")}
              onChange={(e) => updateProject(proj.id, { bullets: e.target.value.split("\n") })}
              placeholder="Built REST API with Node.js&#10;Deployed on AWS EC2"
              className={textareaClass + " min-h-[80px]"}
            />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addProject} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </Section>

      {/* Education */}
      <Section title="Education">
        {data.education.map((edu) => (
          <div key={edu.id} className="rounded-lg border border-border p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Input
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              placeholder="B.Tech Computer Science"
              className={inputClass}
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                placeholder="IIT Delhi"
                className={inputClass}
              />
              <Input
                value={edu.year}
                onChange={(e) => updateEducation(edu.id, { year: e.target.value })}
                placeholder="2020 – 2024"
                className={inputClass}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addEducation} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </Section>

      {/* Sidebar sections */}
      <Section title="Skills">
        <TagInput value={data.skills} onChange={updateArray("skills")} placeholder="React, TypeScript, Python..." />
      </Section>

      <Section title="Tools">
        <TagInput value={data.tools} onChange={updateArray("tools")} placeholder="Docker, AWS, Figma..." />
      </Section>

      <Section title="Certifications">
        <TagInput value={data.certifications} onChange={updateArray("certifications")} placeholder="AWS Solutions Architect..." />
      </Section>

      <Section title="Languages">
        <TagInput value={data.languages} onChange={updateArray("languages")} placeholder="English, Hindi..." />
      </Section>

      <Section title="Achievements">
        <TagInput value={data.achievements} onChange={updateArray("achievements")} placeholder="Won hackathon at IIT..." />
      </Section>
    </div>
  );
};

export default ResumeFormV2;
