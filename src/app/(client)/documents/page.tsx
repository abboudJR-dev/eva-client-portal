import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileText, ExternalLink } from "lucide-react";

export default async function DocumentsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const project = await prisma.project.findFirst({
    where: { clientId: session.user.id },
    include: { documents: { orderBy: { uploadedAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[#8A8279]">No project found.</p>
      </div>
    );
  }

  const grouped = project.documents.reduce<Record<string, typeof project.documents>>((acc, doc) => {
    const phase = doc.phase || "General";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(doc);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#C5A258] font-semibold mb-1">Documentation</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#1A1A1A]">
          Your Documents
        </h1>
        <p className="text-sm text-[#8A8279] mt-2">
          All documents, files, and links related to your design journey.
        </p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#C8BFB2]/30">
          <FileText size={32} className="mx-auto text-[#C8BFB2] mb-3" />
          <p className="text-[#8A8279]">Documents will appear here as your project progresses.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([phase, docs]) => (
            <div key={phase}>
              <h2 className="text-xs tracking-widest uppercase text-[#C5A258] font-bold mb-3 pb-2 border-b border-[#C8BFB2]/20">
                {phase}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="bg-white border border-[#C8BFB2]/30 p-4 flex items-start gap-3 hover:shadow-sm hover:border-[#C5A258]/30 transition-all">
                    <div className="w-10 h-10 flex-shrink-0 bg-[#F0EBE3] flex items-center justify-center">
                      <FileText size={18} className="text-[#C5A258]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[family-name:var(--font-display)] text-sm font-medium text-[#1A1A1A] truncate">
                        {doc.name}
                      </h3>
                      {doc.description && (
                        <p className="text-xs text-[#8A8279] mt-0.5 line-clamp-2">{doc.description}</p>
                      )}
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#C5A258] hover:text-[#A68A3E] font-medium"
                        >
                          Open Document <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
