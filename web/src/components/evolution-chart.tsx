import { useTranslation } from "react-i18next";
import { InfoTip } from "./info-tip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  ano: number;
  [key: string]: number;
}

interface EvolutionChartProps {
  data: DataPoint[];
  iesA: string;
  iesB: string;
}

export function EvolutionChart({ data, iesA, iesB }: EvolutionChartProps) {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <h4 className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider mb-3 ds-mono text-center">
        {t("compare.evolution")}<InfoTip text={t("compare.tip_evolution")} />
      </h4>
      {data.length <= 1 && (
        <p className="text-text-muted text-[10px] sm:text-xs mb-3 ds-mono">
          {t("compare.evolution_single_year")}
        </p>
      )}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--ds-border)"
          />
          <XAxis
            dataKey="ano"
            tick={{ fill: "var(--ds-text-muted)", fontSize: 10 }}
            stroke="var(--ds-border)"
          />
          <YAxis
            domain={[0, 5.3]}
            tick={{ fill: "var(--ds-text-muted)", fontSize: 10 }}
            stroke="var(--ds-border)"
          />
          <Tooltip
            contentStyle={{
              background: "var(--ds-surface)",
              border: "1px solid var(--ds-border)",
              borderRadius: "var(--ds-radius-md)",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey={iesA}
            stroke="var(--ds-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey={iesB}
            stroke="var(--ds-secondary)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
