import type { Metadata } from "next";
import MobileShowcase from "@/components/showcase/mobile-showcase";

export const metadata: Metadata = {
  title: "EVA — Mobile App",
  description:
    "Two phones, one studio: EVA's client app for tracking progress and swipe-to-approve, paired with the designer companion's live operations pulse.",
};

export default function MobileShowcasePage() {
  return <MobileShowcase />;
}
