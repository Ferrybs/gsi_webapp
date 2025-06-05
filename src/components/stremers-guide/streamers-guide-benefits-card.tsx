import { Check, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface BenefitsCardProps {
  title: string;
  description: string;
  content: string[];
}

function StreamerGuideBenefitsCard({
  title,
  description,
  content,
}: BenefitsCardProps) {
  return (
    <Card className="bg-card/30 border-border/30">
      <CardHeader>
        <Users className="h-10 w-10 text-primary mb-2" />
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {content.map((item, idx) => (
            <li
              key={"StreamerGuideBenefitsCard-" + idx}
              className="flex items-start gap-2"
            >
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default StreamerGuideBenefitsCard;
