import React from "react";

export interface ResumeData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  degree: string;
  college: string;
  year: string;
  programmingLanguages: string;
  toolsTechnologies: string;
  softSkills: string;
  experience: string;
  projects: string;
  certifications: string;
  careerObjective: string;
}

export const emptyResume: ResumeData = {
  fullName: "",
  phone: "",
  email: "",
  linkedin: "",
  degree: "",
  college: "",
  year: "",
  programmingLanguages: "",
  toolsTechnologies: "",
  softSkills: "",
  experience: "",
  projects: "",
  certifications: "",
  careerObjective: "",
};

const parseBullets = (text: string): string[] =>
  text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-1">
    <h3
      style={{
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        borderBottom: "1.5px solid #222",
        paddingBottom: "2px",
        marginBottom: "6px",
        color: "#111",
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
      }}
    >
      {children}
    </h3>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul
    style={{
      margin: 0,
      paddingLeft: "18px",
      listStyleType: "disc",
      fontSize: "10.5px",
      lineHeight: "1.55",
      color: "#222",
      fontFamily: "'Inter', Arial, Helvetica, sans-serif",
    }}
  >
    {items.map((item, i) => (
      <li key={i} style={{ marginBottom: "2px" }}>
        {item}
      </li>
    ))}
  </ul>
);

const SkillRow = ({ label, value }: { label: string; value: string }) => {
  if (!value.trim()) return null;
  return (
    <div
      style={{
        fontSize: "10.5px",
        lineHeight: "1.55",
        color: "#222",
        marginBottom: "2px",
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
      }}
    >
      <strong>{label}:</strong> {value}
    </div>
  );
};

interface ResumePreviewProps {
  data: ResumeData;
  isPaid: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
}

const ResumePreview = ({ data, isPaid, previewRef }: ResumePreviewProps) => {
  const experienceBullets = parseBullets(data.experience);
  const projectBullets = parseBullets(data.projects);
  const certBullets = parseBullets(data.certifications);

  const contactParts = [data.email, data.phone, data.linkedin].filter(Boolean);

  return (
    <div
      ref={previewRef}
      className="relative"
      style={{
        background: "#fff",
        color: "#111",
        fontFamily: "'Inter', Arial, Helvetica, sans-serif",
        fontSize: "10.5px",
        lineHeight: "1.55",
        padding: "40px 42px",
        maxWidth: "794px",
        minHeight: "700px",
        margin: "0 auto",
        boxSizing: "border-box",
        borderRadius: "4px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Watermark overlay — only shown when unpaid */}
      {!isPaid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "rgba(0,0,0,0.06)",
              transform: "rotate(-35deg)",
              whiteSpace: "nowrap",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              userSelect: "none",
            }}
          >
            FreshersPro – Preview Only
          </span>
        </div>
      )}

      {/* ── Name ── */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.02em",
            color: "#111",
            textTransform: "uppercase",
            fontFamily: "'Inter', Arial, Helvetica, sans-serif",
          }}
        >
          {data.fullName || "YOUR FULL NAME"}
        </h1>
      </div>

      {/* ── Contact line ── */}
      {contactParts.length > 0 && (
        <div
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#444",
            marginBottom: "16px",
            fontFamily: "'Inter', Arial, Helvetica, sans-serif",
          }}
        >
          {contactParts.join("  |  ")}
        </div>
      )}

      {/* ── Career Objective ── */}
      {data.careerObjective && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Career Objective</SectionTitle>
          <p
            style={{
              margin: 0,
              fontSize: "10.5px",
              color: "#222",
              lineHeight: "1.6",
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
            }}
          >
            {data.careerObjective}
          </p>
        </div>
      )}

      {/* ── Education ── */}
      {(data.degree || data.college) && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Education</SectionTitle>
          <div
            style={{
              fontSize: "10.5px",
              color: "#222",
              fontFamily: "'Inter', Arial, Helvetica, sans-serif",
            }}
          >
            <strong>{data.degree}</strong>
            {data.college && <span> — {data.college}</span>}
            {data.year && (
              <span style={{ color: "#555", marginLeft: "6px" }}>
                ({data.year})
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {(data.programmingLanguages || data.toolsTechnologies || data.softSkills) && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Skills</SectionTitle>
          <SkillRow label="Programming Languages" value={data.programmingLanguages} />
          <SkillRow label="Tools & Technologies" value={data.toolsTechnologies} />
          <SkillRow label="Soft Skills" value={data.softSkills} />
        </div>
      )}

      {/* ── Experience ── */}
      {experienceBullets.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Experience</SectionTitle>
          <BulletList items={experienceBullets} />
        </div>
      )}

      {/* ── Projects ── */}
      {projectBullets.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Projects</SectionTitle>
          <BulletList items={projectBullets} />
        </div>
      )}

      {/* ── Certifications ── */}
      {certBullets.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Certifications</SectionTitle>
          <BulletList items={certBullets} />
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
