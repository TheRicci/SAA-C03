import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import DocsTopbar from "../components/DocsTopbar";

export type CheatsheetCard = {
  id: string;
  serviceName: string;
  icon: StaticImageData;
  groupColor: string;
  what: string;
  keyPoints: string[];
  trapPoints: string[];
  when: string;
};

export type CheatsheetGroup = {
  slug: string;
  name: string;
  color: string;
  cards: CheatsheetCard[];
};

type CheatsheetGridProps = {
  groups: CheatsheetGroup[];
};

function renderList(items: string[], emptyLabel: string) {
  if (items.length === 0) {
    return <p className="docs-cheatsheet-empty">{emptyLabel}</p>;
  }

  return (
    <ul className="docs-cheatsheet-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export default function CheatsheetGrid({ groups }: CheatsheetGridProps) {
  return (
    <main className="docs-page">
      <DocsTopbar />
      <div className="docs-shell docs-layout">
        <aside className="docs-sidebar">
          <p className="docs-sidebar-title">On this page</p>
          <ul className="docs-sidebar-list">
            {groups.map((group) => (
              <li key={group.slug}>
                <a className="docs-sidebar-link" href={`#group-${group.slug}`}>
                  {group.name}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="docs-content">
          <nav className="docs-nav">
            <Link href="/" className="docs-back">
              {"<- Home"}
            </Link>
          </nav>

          <header className="docs-header">
            <p className="docs-kicker">AWS Certified Solutions Architect - Associate</p>
            <h1 className="docs-title">SAA-C03 In-Scope Services Cheat Sheet</h1>
            <p className="docs-subtitle">
              Concise, exam-focused notes for each service. Use this to review what each service does,
              key details, common traps, and when to choose it.
            </p>
          </header>

          <div className="docs-divider" aria-hidden="true" />

          {groups.map((group) => (
            <section key={group.slug} id={`group-${group.slug}`} className="docs-section">
              <div>
                <h2 className="docs-section-title">{group.name}</h2>
                <p className="docs-subtitle">{group.cards.length} services</p>
              </div>

              <div className="docs-cheatsheet-group">
                {group.cards.map((card) => (
                  <article
                    key={card.id}
                    className="docs-cheatsheet-card"
                    style={{ "--accent": card.groupColor } as CSSProperties}
                  >
                    <header className="docs-cheatsheet-header">
                      <Image
                        src={card.icon}
                        alt={`${card.serviceName} icon`}
                        width={32}
                        height={32}
                        className="docs-service-icon"
                      />
                      <div>
                        <h3 className="docs-cheatsheet-title">{card.serviceName}</h3>
                        <p className="docs-cheatsheet-tagline">{card.what}</p>
                      </div>
                    </header>

                    <div className="docs-divider" aria-hidden="true" />

                    <div className="docs-cheatsheet-body">
                      <div className="docs-cheatsheet-section">
                        <p className="docs-kicker">Key</p>
                        {renderList(card.keyPoints, "No key points listed.")}
                      </div>

                      <div className="docs-cheatsheet-section docs-cheatsheet-trap">
                        <span className="docs-trap-pill">Trap</span>
                        {renderList(card.trapPoints, "No traps listed.")}
                      </div>

                      <div className="docs-cheatsheet-section">
                        <p className="docs-kicker">When</p>
                        <p className="docs-cheatsheet-when">{card.when}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
