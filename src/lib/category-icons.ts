import {
  Pill,
  Droplets,
  Citrus,
  Baby,
  SprayCan,
  Stethoscope,
  Leaf,
  Scissors,
  type LucideIcon,
} from "lucide-react";

/** Icon mapping per category slug — shared between the home
 *  category strip and the /categories page so they always match. */
export const categoryIcons: Record<string, LucideIcon> = {
  medicines: Pill,
  skincare: Droplets,
  vitamins: Citrus,
  baby: Baby,
  personal_care: SprayCan,
  medical_devices: Stethoscope,
  supplements: Leaf,
  hair_care: Scissors,
};

export const fallbackIcons: LucideIcon[] = [
  Pill,
  Droplets,
  Leaf,
  Stethoscope,
  SprayCan,
  Citrus,
];

export function getCategoryIcon(slug: string, index: number): LucideIcon {
  return categoryIcons[slug] || fallbackIcons[index % fallbackIcons.length];
}
