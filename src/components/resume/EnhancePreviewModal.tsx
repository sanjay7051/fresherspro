import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import type { ResumeData } from "@/types/resume";

interface Props {
  open: boolean;
  onClose: () => void;
  original: ResumeData;
  enhanced: ResumeData;
  onAccept: () => void;
}

const Diff = ({ label, before, after }: { label: string; before: string; after: string }) => {
  if (before === after || !after.trim()) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-border bg-muted/40 p-3 text-muted-foreground line-through">
          {before || <span className="italic">Empty</span>}
        </div>
        <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-foreground">
          {after}
        </div>
      </div>
    </div>
  );
};

const BulletDiff = ({ label, before, after }: { label: string; before: string[]; after: string[] }) => {
  const changed = before.some((b, i) => b !== after[i]);
  if (!changed) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <ul className="rounded-md border border-border bg-muted/40 p-3 space-y-1 list-disc list-inside text-muted-foreground">
          {before.filter(Boolean).map((b, i) => <li key={i} className="line-through">{b}</li>)}
        </ul>
        <ul className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-1 list-disc list-inside text-foreground">
          {after.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
};

const EnhancePreviewModal = ({ open, onClose, original, enhanced, onAccept }: Props) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Enhancement Preview</DialogTitle>
          <p className="text-sm text-muted-foreground">Review the suggested improvements before applying.</p>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <Diff label="Summary" before={original.summary} after={enhanced.summary} />

          {enhanced.experience.map((exp, i) => (
            <BulletDiff
              key={exp.id}
              label={`Experience: ${exp.title || exp.company || `#${i + 1}`}`}
              before={original.experience[i]?.bullets ?? []}
              after={exp.bullets}
            />
          ))}

          {enhanced.projects.map((proj, i) => (
            <BulletDiff
              key={proj.id}
              label={`Project: ${proj.name || `#${i + 1}`}`}
              before={original.projects[i]?.bullets ?? []}
              after={proj.bullets}
            />
          ))}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" /> Discard
          </Button>
          <Button onClick={onAccept}>
            <Check className="h-4 w-4 mr-1" /> Accept Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancePreviewModal;
