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
  frameworksLibraries: string;
  toolsPlatforms: string;
  databases: string;
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
  frameworksLibraries: "",
  toolsPlatforms: "",
  databases: "",
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
  <h2
    style={{
      fontSize: "13px",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      borderBottom: "1px solid #222",
      paddingBottom: "6px",
      marginBottom: "12px",
      marginTop: "28px",
    }}
  >
    {children}
  </h2>
);

const SkillRow = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null;
  return (
    <div style={{ fontSize: "12px", lineHeight: "1.7", marginBottom: "4px" }}>
      <strong>{label}:</strong> <span style={{ color: "#333" }}>{value}</span>
    </div>
  );
};

const BulletList = ({ items }: { items: string[] }) => (
  <ul
    style={{
      paddingLeft: "20px",
      marginTop: "6px",
      fontSize: "12px",
      lineHeight: "1.65",
    }}
  >
    {items.map((item, i) => (
      <li key={i} style={{ marginBottom: "8px" }}>
        {item}
      </li>
    ))}
  </ul>
);

const ResumePreview = ({
  data,
  isPaid,
  previewRef,
}: {
  data: ResumeData;
  isPaid: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
}) => {
  const experienceBullets = parseBullets(data.experience);
  const projectBullets = parseBullets(data.projects);
  const certBullets = parseBullets(data.certifications);

  const contactParts = [data.email, data.phone, data.linkedin].filter(Boolean);

  const hasSkills =
    data.programmingLanguages ||
    data.frameworksLibraries ||
    data.toolsPlatforms ||
    data.databases ||
    data.softSkills;

  return (
    <div
      ref={previewRef}
      style={{
        background: "#fff",
        color: "#111",
        fontFamily: "'Inter', Arial, sans-serif",
        maxWidth: "820px",
        margin: "0 auto",
        padding: "48px",
        boxSizing: "border-box",
        borderRadius: "8px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
        position: "relative",
      }}
    >
      {/* Watermark overlay */}
      {!isPaid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: "3rem",
              fontWeight: 800,
              color: "rgba(0,0,0,0.05)",
              transform: "rotate(-30deg)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            FreshersPro Preview
          </span>
        </div>
      )}

      {/* Name */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {data.fullName || "Your Full Name"}
        </h1>
      </div>

      {/* Contact */}
      {contactParts.length > 0 && (
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          {contactParts.join("  |  ")}
        </div>
      )}

      {/* Career Objective */}
      {data.careerObjective && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Professional Summary</SectionTitle>
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

      {/* Education */}
      {(data.degree || data.college) && (
        <>
          <SectionTitle>Education</SectionTitle>
          <div style={{ fontSize: "12px", lineHeight: "1.7" }}>
            <strong>{data.degree}</strong>
            {data.college && <span> — {data.college}</span>}
            {data.year && (
              <span style={{ color: "#666", marginLeft: "6px" }}>
                ({data.year})
              </span>
            )}
          </div>
        </>
      )}

      {/* Skills */}
      {hasSkills && (
        <div style={{ marginBottom: "14px" }}>
          <SectionTitle>Technical Skills</SectionTitle>
          <SkillRow label="Programming Languages" value={data.programmingLanguages} />
          <SkillRow label="Frameworks & Libraries" value={data.frameworksLibraries} />
          <SkillRow label="Tools & Platforms" value={data.toolsPlatforms} />
          <SkillRow label="Databases" value={data.databases} />
          <SkillRow label="Soft Skills" value={data.softSkills} />
        </div>
      )}

      {/* Experience */}
      {experienceBullets.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <BulletList items={experienceBullets} />
        </>
      )}

      {/* Projects */}
      {projectBullets.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <BulletList items={projectBullets} />
        </>
      )}

      {/* Certifications */}
      {certBullets.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <BulletList items={certBullets} />
        </>
      )}
    </div>
  );
};

export default ResumePreview;