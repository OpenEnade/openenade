import { useTranslation } from "react-i18next";

interface RedeBadgeProps {
  value: "PUBLICA" | "PRIVADA";
}

export function RedeBadge({ value }: RedeBadgeProps) {
  const { t } = useTranslation();
  const isPub = value === "PUBLICA";

  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-[var(--ds-radius-sm)] font-semibold ds-mono ${
        isPub
          ? "bg-primary/15 text-primary"
          : "bg-text-muted/20 text-text-muted"
      }`}
    >
      {isPub ? t("table.pub") : t("table.priv")}
    </span>
  );
}
