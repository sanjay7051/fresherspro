import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  role: string;
  summary: string;
  skills: string;
  education: string;
  projects: string;
  experience: string;
  certifications: string;
}

const ResumeBuilder = () => {
  const [isFresher, setIsFresher] = useState(true);

  const [data, setData] = useState<ResumeData>({
    name: "",
    email: "",
    phone: "",
    role: "",
    summary: "",
    skills: "",
    education: "",
    projects: "",
    experience: "",
    certifications: "",
  });

  const [score, setScore] = useState<number | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  const handleChange = (field: keyof ResumeData, value: string) => {
    if (field === "phone") {
      const onlyNumbers = value.replace(/\D/g, "");
      if (onlyNumbers.length <= 10) {
        setData({ ...data, phone: onlyNumbers });
      }
    } else {
      setData({ ...data, [field]: value });
    }
  };

  const analyzeATS = () => {
    let total = 0;
    const missingFields: string[] = [];

    const fieldsToCheck = [
      "name",
      "email",
      "phone",
      "role",
      "summary",
      "skills",
      "education",
      "projects",
    ];

    if (!isFresher) fieldsToCheck.push("experience");

    fieldsToCheck.forEach((field) => {
      if (data[field as keyof ResumeData].trim().length > 5) {
        total += 10;
      } else {
        missingFields.push(field);
      }
    });

    setScore(total);
    setMissing(missingFields);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 border">

        <h1 className="text-3xl font-bold text-center mb-8">
          Build Your Professional Resume
        </h1>

        {/* Fresher Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={isFresher ? "default" : "outline"}
            onClick={() => setIsFresher(true)}
          >
            Fresher
          </Button>
          <Button
            variant={!isFresher ? "default" : "outline"}
            onClick={() => setIsFresher(false)}
          >
            Experienced
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            placeholder="Phone (10 digits)"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <Input
            placeholder={
              isFresher
                ? "Target Role (e.g. Frontend Developer)"
                : "Current Role"
            }
            value={data.role}
            onChange={(e) => handleChange("role", e.target.value)}
          />
        </div>

        <div className="mt-6 space-y-6">
          <Textarea
            placeholder="Professional Summary"
            value={data.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
          />

          <Textarea
            placeholder="Skills (comma separated)"
            value={data.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
          />

          <Textarea
            placeholder="Education"
            value={data.education}
            onChange={(e) => handleChange("education", e.target.value)}
          />

          <Textarea
            placeholder="Projects"
            value={data.projects}
            onChange={(e) => handleChange("projects", e.target.value)}
          />

          {!isFresher && (
            <Textarea
              placeholder="Work Experience"
              value={data.experience}
              onChange={(e) => handleChange("experience", e.target.value)}
            />
          )}

          <Textarea
            placeholder="Certifications"
            value={data.certifications}
            onChange={(e) =>
              handleChange("certifications", e.target.value)
            }
          />
        </div>

        <div className="text-center mt-8">
          <Button size="lg" onClick={analyzeATS}>
            Check ATS Score
          </Button>
        </div>

        {score !== null && (
          <div className="mt-10 text-center">
            <h2 className="text-5xl font-bold text-green-600">
              {score} / 100
            </h2>

            {missing.length > 0 ? (
              <div className="mt-6 bg-red-50 border p-6 rounded-xl">
                <div className="flex items-center gap-2 justify-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="font-semibold">
                    Improve These Sections
                  </span>
                </div>
                <ul className="text-sm space-y-2">
                  {missing.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-6 bg-green-50 border p-6 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Excellent Resume Structure!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;