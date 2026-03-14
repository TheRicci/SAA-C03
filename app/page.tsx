import Link from "next/link";
import DocsTopbar from "./components/DocsTopbar";

export default function Page() {
  return (
    <main className="docs-page">
      <DocsTopbar />
      <div className="docs-shell">
        <header className="docs-header">
          <p className="docs-kicker">AWS Certified Solutions Architect - Associate</p>
          <h1 className="docs-title">SAA-C03 Study Resources</h1>
          <p className="docs-subtitle">Choose a study mode to begin.</p>
        </header>

        <div className="docs-divider" aria-hidden="true" />

        <section className="docs-section" aria-label="Study modes">
          <h2 className="docs-section-title">Study modes</h2>
          <div className="docs-button-grid">
            <Link className="docs-button" href="/cheatsheet">
              <span className="docs-button-title">Cheat Sheet Review</span>
              <span className="docs-button-desc">
                Concise service summaries with key points, traps, and when to use each service.
              </span>
            </Link>
            <Link className="docs-button" href="/v3">
              <span className="docs-button-title">Full Notes (V3)</span>
              <span className="docs-button-desc">
                Structured study notes with deeper explanations and full content coverage.
              </span>
            </Link>
          </div>
          <a
            className="docs-button docs-button-wide"
            href="https://aws.amazon.com/pt/certification/certified-solutions-architect-associate/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="docs-button-title">Official AWS SAA-C03 Certification Page</span>
            <span className="docs-button-desc">Open the official AWS certification page.</span>
          </a>
        </section>

      </div>
    </main>
  );
}
