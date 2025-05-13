import { JSX } from "react";

export default function HomeFeatureItem({
  icon,
  title,
  desc,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card/30 p-6 rounded-xl border border-border/30 flex items-start gap-4">
      <div className="bg-primary/20 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-foreground/70">{desc}</p>
      </div>
    </div>
  );
}
