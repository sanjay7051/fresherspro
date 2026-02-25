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
      fontSize: "15px",
      fontWeight: 700,
      borderBottom: "1px solid #000",
      paddingBottom: "4px",
      marginTop: "24px",
      marginBottom: "10px",
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
        background: "#ffffff",
        color: "#000",
        fontFamily: "Times New Roman, serif",
        fontSize: "14px",
        lineHeight: "1.6",
        width: "794px",
        minHeight: "1123px",
        margin: "0 auto",
        padding: "50px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
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
              color: "rgba(0,0,0,0.06)",
              transform: "rotate(-30deg)",
              letterSpacing: "4px",
            }}
          >
            FRESHERSPRO PREVIEW
          </span>
        </div>
      )}

      {/* Name */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {data.fullName || "Your Name"}
        </h1>
      </div>

      {/* Contact */}
      {contactParts.length > 0 && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {contactParts.join(" | ")}
        </div>
      )}

      {/* Professional Summary */}
      {data.careerObjective && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ margin: 0 }}>{data.careerObjective}</p>
        </>
      )}

      {/* Education */}
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

      {/* Skills */}
      {hasSkills && (
        <>
          <SectionTitle>Technical Skills</SectionTitle>
          {data.programmingLanguages && (
            <div><strong>Programming Languages:</strong> {data.programmingLanguages}</div>
          )}
          {data.frameworksLibraries && (
            <div><strong>Frameworks & Libraries:</strong> {data.frameworksLibraries}</div>
          )}
          {data.toolsPlatforms && (
            <div><strong>Tools & Platforms:</strong> {data.toolsPlatforms}</div>
          )}
          {data.databases && (
            <div><strong>Databases:</strong> {data.databases}</div>
          )}
          {data.softSkills && (
            <div><strong>Soft Skills:</strong> {data.softSkills}</div>
          )}
        </>
      )}

      {/* Experience */}
      {experienceBullets.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
            {experienceBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Projects */}
      {projectBullets.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
            {projectBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "6px" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Certifications */}
      {certBullets.length > 0 && (
        <>
          <SectionTitle>Certifications</SectionTitle>
          <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
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