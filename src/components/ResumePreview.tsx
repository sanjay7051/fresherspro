import React from "react";

export interface ResumeData {
  fullName: string;
  phone: string;
  email: string;
  linkedin: string;
  github?: string;
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
  github: "",
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
      fontSize: "15px",
      fontWeight: 700,
      textTransform: "uppercase",
      borderBottom: "1px solid #000",
      paddingBottom: "5px",
      marginTop: "28px",
      marginBottom: "12px",
      letterSpacing: "1px",
    }}
  >
    {children}
  </h2>
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

  return (
    <div
      ref={previewRef}
      style={{
        background: "#fff",
        color: "#000",
        fontFamily: "Times New Roman, serif",
        width: "794px",
        minHeight: "1123px",
        margin: "0 auto",
        padding: "60px",
        boxSizing: "border-box",
        lineHeight: "1.6",
        position: "relative",
      }}
    >
      {/* Watermark */}
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
              fontSize: "40px",
              fontWeight: 700,
              color: "rgba(0,0,0,0.05)",
              transform: "rotate(-30deg)",
              letterSpacing: "4px",
            }}
          >
            FRESHERSPRO PREVIEW
          </span>
        </div>
      )}

      {/* NAME */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          {(data.fullName || "YOUR NAME").toUpperCase()}
        </h1>
      </div>

      {/* CONTACT */}
      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        {data.phone && <span>{data.phone}</span>}
        {data.email && <span> | {data.email}</span>}
        {data.linkedin && <span> | {data.linkedin}</span>}
        {data.github && <span> | {data.github}</span>}
      </div>

      {/* PROFESSIONAL SUMMARY */}
      {data.careerObjective && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ margin: 0 }}>{data.careerObjective}</p>
        </>
      )}

      {/* EXPERIENCE (After Summary as requested) */}
      {experienceBullets.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <ul style={{ paddingLeft: "20px" }}>
            {experienceBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* PROJECTS */}
      {projectBullets.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <ul style={{ paddingLeft: "20px" }}>
            {projectBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* TECHNICAL SKILLS */}
      {(data.programmingLanguages ||
        data.frameworksLibraries ||
        data.toolsPlatforms ||
        data.databases ||
        data.softSkills) && (
          <>
            <SectionTitle>Technical Skills</SectionTitle>

            {data.programmingLanguages && (
              <div>
                <strong>Programming Languages:</strong>{" "}
                {data.programmingLanguages}
              </div>
            )}

            {data.frameworksLibraries && (
              <div>
                <strong>Frameworks & Libraries:</strong>{" "}
                {data.frameworksLibraries}
              </div>
            )}

            {data.toolsPlatforms && (
              <div>
                <strong>Tools & Platforms:</strong>{" "}
                {data.toolsPlatforms}
              </div>
            )}

            {data.databases && (
              <div>
                <strong>Databases:</strong> {data.databases}
              </div>
            )}

            {data.softSkills && (
              <div>
                <strong>Soft Skills:</strong> {data.softSkills}
              </div>
            )}
          </>
        )}

      {/* EDUCATION */}
      {(data.degree || data.college) && (
        <>
          <SectionTitle>Education</SectionTitle>
          <div>
            <strong>{data.degree}</strong>
            {data.college && <> — {data.college}</>}
            {data.year && <> ({data.year})</>}
          </div>
        </>
      )}

      {/* CERTIFICATIONS */}
      {certBullets.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <ul style={{ paddingLeft: "20px" }}>
            {certBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ResumePreview;