import React from "react";
import { formatText } from "@/utils/textFormatter";

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
      fontSize: "13px",
      fontWeight: 700,
      textTransform: "uppercase",
      borderBottom: "1.5px solid #222",
      paddingBottom: "4px",
      marginTop: "22px",
      marginBottom: "10px",
      letterSpacing: "1.5px",
      color: "#111",
    }}
  >
    {children}
  </h2>
);

interface Props {
  data: ResumeData;
  isPaid: boolean;
}

const ResumePreview: React.FC<Props> = ({ data, isPaid }) => {
  const experienceBullets = parseBullets(data.experience);
  const projectBullets = parseBullets(data.projects);
  const certBullets = parseBullets(data.certifications);

  return (
    <div
      style={{
        background: "#fff",
        color: "#222",
        fontFamily: "'Times New Roman', 'Georgia', serif",
        width: "100%",
        margin: "0 auto",
        lineHeight: "1.5",
        fontSize: "13.5px",
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
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "2.5px",
            color: "#000",
          }}
        >
          {(data.fullName || "YOUR NAME").toUpperCase()}
        </h1>
      </div>

      {/* CONTACT */}
      <div
        style={{
          textAlign: "center",
          fontSize: "12.5px",
          color: "#444",
          marginBottom: "16px",
          letterSpacing: "0.3px",
        }}
      >
        {data.phone && <span>{data.phone}</span>}
        {data.email && <span> | {data.email}</span>}
        {data.linkedin && <span> | {data.linkedin}</span>}
        {data.github && <span> | {data.github}</span>}
      </div>

      {/* SUMMARY */}
      {data.careerObjective && (
        <>
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ margin: 0, lineHeight: "1.55", color: "#333" }}>
            {data.careerObjective}
          </p>
        </>
      )}

      {/* EXPERIENCE */}
      {experienceBullets.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {experienceBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "5px", color: "#333" }}>
                {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* SKILLS */}
      {(data.programmingLanguages ||
        data.frameworksLibraries ||
        data.toolsPlatforms ||
        data.databases ||
        data.softSkills) && (
          <>
            <SectionTitle>Skills</SectionTitle>

            {data.programmingLanguages && (
              <div>
                <strong>Languages:</strong> {data.programmingLanguages}
              </div>
            )}

            {data.frameworksLibraries && (
              <div>
                <strong>Frameworks:</strong> {data.frameworksLibraries}
              </div>
            )}

            {data.toolsPlatforms && (
              <div>
                <strong>Tools:</strong> {data.toolsPlatforms}
              </div>
            )}

            {data.databases && (
              <div>
                <strong>Databases:</strong> {data.databases}
              </div>
            )}

            {data.softSkills && (
              <div>
                <strong>Communication:</strong> {data.softSkills}
              </div>
            )}
          </>
        )}

      {/* PROJECTS */}
      {projectBullets.length > 0 && (
        <>
          <SectionTitle>Projects</SectionTitle>
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {projectBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "5px", color: "#333" }}>
                {item}
              </li>
            ))}
          </ul>
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
          <ul style={{ paddingLeft: "18px", margin: 0 }}>
            {certBullets.map((item, i) => (
              <li key={i} style={{ marginBottom: "4px", color: "#333" }}>
                {formatText(item)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ResumePreview;