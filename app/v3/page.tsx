import Link from "next/link";

import { v3Groups, v3SubgroupsByGroupSlug } from "../sectionsDataV3";
import DocsTopbar from "../components/DocsTopbar";

export default function Page() {
  return (
    <main className="docs-page">
      <DocsTopbar />
      <div className="docs-shell">
        <nav className="docs-nav">
          <Link href="/" className="docs-back">
            {"<- Home"}
          </Link>
        </nav>

        <header className="docs-header">
          <p className="docs-kicker">AWS Certified Solutions Architect - Associate</p>
          <h1 className="docs-title">SAA-C03 Study Notes (V3)</h1>
          <p className="docs-subtitle">Browse the in-scope service categories.</p>
        </header>

        <div className="docs-divider" aria-hidden="true" />

        <section className="docs-section" aria-label="SAA-C03 v3 categories">
          <h2 className="docs-section-title">Categories</h2>
          <ul className="docs-list">
            {v3Groups.map((group) => {
              const count = Object.keys(v3SubgroupsByGroupSlug[group.slug] ?? {}).length;
              return (
                <li key={group.slug} className="docs-list-item">
                  <Link className="docs-link" href={`/v3/sections/${group.slug}`}>
                    {group.name}
                  </Link>
                  <span className="docs-count">{count} services</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
