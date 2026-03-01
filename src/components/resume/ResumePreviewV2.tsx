import React from "react";
import type { ResumeData } from "@/types/resume";

const ACCENT = "#1E3A8A";
const PRIMARY = "#111827";
const SECONDARY = "#4B5563";
const LIGHT = "#9CA3AF";

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: "12px" }}>
    <h2
      style={{
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        color: PRIMARY,
        margin: 0,
        paddingBottom: "6px",
        borderBottom: `2px solid ${ACCENT}`,
        display: "inline-block",
      }}
    >
      {children}
    </h2>
  </div>
);

const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: "10px" }}>
    <h2
      style={{
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        color: "#fff",
        margin: 0,
        paddingBottom: "5px",
        borderBottom: "1.5px solid rgba(255,255,255,0.3)",
        display: "inline-block",
      }}
    >
      {children}
    </h2>
  </div>
);

const BulletList = ({ items, color = SECONDARY }: { items: string[]; color?: string }) => (
  <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "disc" }}>
    {items.filter(Boolean).map((item, i) => (
      <li key={i} style={{ fontSize: "12.5px", lineHeight: "1.55", color, marginBottom: "3px" }}>
        {item}
      </li>
    ))}
  </ul>
);

const ResumePreviewV2 = ({
  data,
  previewRef,
}: {
  data: ResumeData;
  previewRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={previewRef}
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#fff",
        fontFamily: "'Inter', 'Segoe UI', -apple-system, sans-serif",
        fontSize: "13px",
        lineHeight: "1.5",
        color: PRIMARY,
        display: "flex",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "238px",
          minWidth: "238px",
          background: ACCENT,
          color: "#fff",
          padding: "36px 22px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {/* Contact */}
        <div>
          <SidebarHeading>Contact</SidebarHeading>
          <div style={{ fontSize: "11.5px", lineHeight: "1.7", color: "rgba(255,255,255,0.85)" }}>
            {data.phone && <div>{data.phone}</div>}
            {data.email && <div style={{ wordBreak: "break-all" }}>{data.email}</div>}
            {data.linkedin && <div style={{ wordBreak: "break-all" }}>{data.linkedin}</div>}
            {data.location && <div>{data.location}</div>}
          </div>
        </div>

        {/* Skills */}
        {data.skills.filter(Boolean).length > 0 && (
          <div>
            <SidebarHeading>Skills</SidebarHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {data.skills.filter(Boolean).map((skill, i) => (
                <span key={i} style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {data.tools.filter(Boolean).length > 0 && (
          <div>
            <SidebarHeading>Tools</SidebarHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {data.tools.filter(Boolean).map((tool, i) => (
                <span key={i} style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.filter(Boolean).length > 0 && (
          <div>
            <SidebarHeading>Certifications</SidebarHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {data.certifications.filter(Boolean).map((cert, i) => (
                <span key={i} style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}>
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.filter(Boolean).length > 0 && (
          <div>
            <SidebarHeading>Languages</SidebarHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {data.languages.filter(Boolean).map((lang, i) => (
                <span key={i} style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.85)" }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAIN */}
      <div
        style={{
          flex: 1,
          padding: "36px 32px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Name & Title */}
        <div style={{ marginBottom: "4px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
              color: PRIMARY,
              letterSpacing: "-0.3px",
              lineHeight: "1.2",
            }}
          >
            {data.fullName || "Your Name"}
          </h1>
          {data.jobTitle && (
            <p
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: ACCENT,
                margin: "4px 0 0",
              }}
            >
              {data.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        {data.summary && (
          <div>
            <SectionHeading>Professional Summary</SectionHeading>
            <p style={{ fontSize: "12.5px", lineHeight: "1.6", color: SECONDARY, margin: 0 }}>
              {data.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <SectionHeading>Experience</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <strong style={{ fontSize: "13.5px", color: PRIMARY }}>{exp.title}</strong>
                    <span style={{ fontSize: "11px", color: LIGHT }}>{exp.duration}</span>
                  </div>
                  {exp.company && (
                    <div style={{ fontSize: "12px", color: SECONDARY, marginBottom: "4px" }}>{exp.company}</div>
                  )}
                  {exp.bullets.filter(Boolean).length > 0 && <BulletList items={exp.bullets} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <SectionHeading>Projects</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <strong style={{ fontSize: "13px", color: PRIMARY }}>{proj.name}</strong>
                  {proj.description && (
                    <p style={{ fontSize: "12px", color: SECONDARY, margin: "2px 0 4px" }}>{proj.description}</p>
                  )}
                  {proj.bullets.filter(Boolean).length > 0 && <BulletList items={proj.bullets} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <SectionHeading>Education</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: PRIMARY }}>{edu.degree}</strong>
                    {edu.institution && (
                      <span style={{ fontSize: "12px", color: SECONDARY }}> — {edu.institution}</span>
                    )}
                  </div>
                  {edu.year && <span style={{ fontSize: "11px", color: LIGHT }}>{edu.year}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {data.achievements.filter(Boolean).length > 0 && (
          <div>
            <SectionHeading>Achievements</SectionHeading>
            <BulletList items={data.achievements} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreviewV2;
