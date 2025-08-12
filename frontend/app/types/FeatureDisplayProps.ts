export interface FeatureDisplayProps {
  symbol: "+" | "%";
  from: number;
  to: number;
  title: string;
  desc: string;
  countDir: "up" | "down";
}