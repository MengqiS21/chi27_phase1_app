import { SectionHeading } from "@/components/SectionHeading";
import {
  SURVEY_GROUP_ICONS,
  type SurveyGroupIconKey,
} from "@/content/survey-group-icons";

type Props = {
  icon: SurveyGroupIconKey;
  children: React.ReactNode;
};

export function SurveyGroupHeading({ icon, children }: Props) {
  return (
    <SectionHeading icon={SURVEY_GROUP_ICONS[icon]}>
      {children}
    </SectionHeading>
  );
}
