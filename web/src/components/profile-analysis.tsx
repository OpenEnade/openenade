import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";
import { InfoTip } from "./info-tip";

interface ProfileAnalysisProps {
  a: Avaliacao;
  b: Avaliacao;
}

type Profile = "fg" | "ce" | "balanced";

function classifyProfile(fg: number, ce: number): Profile {
  const ratio = fg / (ce || 1);
  if (ratio > 1.15) return "fg";
  if (ratio < 0.85) return "ce";
  return "balanced";
}

function profileLabel(profile: Profile, t: (key: string) => string): string {
  if (profile === "fg") return t("compare.profile_stronger_fg");
  if (profile === "ce") return t("compare.profile_stronger_ce");
  return t("compare.profile_balanced");
}

function ProfileBar({ fg, ce }: { fg: number; ce: number }) {
  const max = Math.max(fg, ce, 1);
  const fgPct = (fg / max) * 100;
  const cePct = (ce / max) * 100;

  return (
    <div className="flex items-center gap-2 text-[10px] ds-mono">
      <span className="w-6 text-right text-text-muted">FG</span>
      <div className="flex-1 h-1.5 rounded-[var(--ds-radius-sm)] bg-border/40 overflow-hidden">
        <div
          className="h-full rounded-[var(--ds-radius-sm)] bg-primary/70"
          style={{ width: `${fgPct}%` }}
        />
      </div>
      <span className="w-10 text-text-muted">{fg.toFixed(1)}</span>
      <span className="w-6 text-right text-text-muted">CE</span>
      <div className="flex-1 h-1.5 rounded-[var(--ds-radius-sm)] bg-border/40 overflow-hidden">
        <div
          className="h-full rounded-[var(--ds-radius-sm)] bg-secondary/70"
          style={{ width: `${cePct}%` }}
        />
      </div>
      <span className="w-10 text-text-muted">{ce.toFixed(1)}</span>
    </div>
  );
}

export function ProfileAnalysis({ a, b }: ProfileAnalysisProps) {
  const { t } = useTranslation();

  const profileA = classifyProfile(a.nota_fg, a.nota_ce);
  const profileB = classifyProfile(b.nota_fg, b.nota_ce);

  const sameProfile = profileA === profileB;

  // Build comparison narrative
  let narrative: string;
  if (sameProfile) {
    narrative = t("compare.profile_both_same");
  } else {
    const strengthA = profileA === "fg" ? t("compare.profile_stronger_fg").toLowerCase() : t("compare.profile_stronger_ce").toLowerCase();
    const strengthB = profileB === "fg" ? t("compare.profile_stronger_fg").toLowerCase() : t("compare.profile_stronger_ce").toLowerCase();
    const labelA = profileA === "fg" ? "FG" : "CE";
    const labelB = profileB === "fg" ? "FG" : "CE";
    const scoreA = profileA === "fg" ? a.nota_fg.toFixed(1) : a.nota_ce.toFixed(1);
    const scoreB = profileB === "fg" ? b.nota_fg.toFixed(1) : b.nota_ce.toFixed(1);

    narrative = t("compare.profile_comparison", {
      ies_a: a.ies,
      strength_a: strengthA,
      label_a: labelA,
      score_a: scoreA,
      ies_b: b.ies,
      strength_b: strengthB,
      label_b: labelB,
      score_b: scoreB,
    });
  }

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <h4 className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider mb-3 ds-mono text-center">
        {t("compare.profile_title")}<InfoTip text={t("compare.tip_profile")} />
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-3">
        <div>
          <div className="text-[11px] font-semibold ds-mono truncate mb-1">
            {a.ies}
          </div>
          <div className="text-[10px] text-primary ds-mono mb-1.5">
            {profileLabel(profileA, t)}
          </div>
          <ProfileBar fg={a.nota_fg} ce={a.nota_ce} />
        </div>
        <div>
          <div className="text-[11px] font-semibold ds-mono truncate mb-1">
            {b.ies}
          </div>
          <div className="text-[10px] text-primary ds-mono mb-1.5">
            {profileLabel(profileB, t)}
          </div>
          <ProfileBar fg={b.nota_fg} ce={b.nota_ce} />
        </div>
      </div>

      <p className="text-[10px] text-text-muted leading-relaxed">
        {narrative}
      </p>
    </div>
  );
}
