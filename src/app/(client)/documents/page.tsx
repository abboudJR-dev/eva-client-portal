import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function FileIcon({ strokeWidth = 1.6 }: { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  );
}

function formatDate(d: Date | null | undefined): string | null {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function fileExt(url: string | null, name: string): string {
  const src = url || name || "";
  const m = src.match(/\.([a-z0-9]{1,5})(?:\?|#|$)/i);
  if (m) return m[1].toUpperCase();
  return url ? "LINK" : "DOC";
}

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
      <div className="wrap">
        <section className="page">
          <div className="doc-empty" style={{ marginTop: 24 }}>
            <h3>No project found</h3>
            <p>
              Your project is being set up. Documents will appear here once
              everything is ready.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const docs = project.documents;

  return (
    <div className="wrap">
      <section className="page">
        <div className="page-head reveal">
          <span className="eyebrow">Documentation</span>
          <h1>Your Documents</h1>
          <p className="lede">
            All contracts, files, and links related to your design journey —
            gathered as your project progresses.
          </p>
        </div>

        {docs.length > 0 && (
          <div className="doc-grid">
            {docs.map((doc) => {
              const sub =
                [doc.phase, formatDate(doc.uploadedAt)]
                  .filter(Boolean)
                  .join(" · ") || "Document";
              const inner = (
                <>
                  <div className="ft">
                    <FileIcon />
                    <span className="ext">{fileExt(doc.url, doc.name)}</span>
                  </div>
                  <div>
                    <h4>{doc.name}</h4>
                    <div className="sub">{sub}</div>
                  </div>
                </>
              );
              return doc.url ? (
                <a
                  key={doc.id}
                  className="doc-card reveal spotlight"
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={doc.id} className="doc-card reveal spotlight">
                  {inner}
                </div>
              );
            })}
          </div>
        )}

        <div
          className="doc-empty reveal"
          style={{ marginTop: docs.length > 0 ? 18 : 24 }}
        >
          <div className="ic">
            <FileIcon strokeWidth={1.5} />
          </div>
          {docs.length > 0 ? (
            <>
              <h3>More arrives with every phase</h3>
              <p>
                Moodboards, 3D renders, and 2D drawing packages will appear here
                as your project advances through each stage.
              </p>
            </>
          ) : (
            <>
              <h3>Your documents will gather here</h3>
              <p>
                Contracts, moodboards, renders, and drawing packages will appear
                here as your project advances through each stage.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
