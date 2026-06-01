import RevealManager from "@/components/reveal-manager";

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <RevealManager />
    </>
  );
}
