import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import {
  getV3SubgroupMapByGroupSlug,
  getV3GroupBySlug,
} from "../../../sectionsDataV3";
import DocsTopbar from "../../../components/DocsTopbar";

type GroupPageProps = {
  params: Promise<{ groupSlug: string }>;
};

export default async function Page({ params }: GroupPageProps) {
  const { groupSlug } = await params;
  const subgroupMap = getV3SubgroupMapByGroupSlug(groupSlug);
  const parentGroup = getV3GroupBySlug(groupSlug);

  if (!parentGroup) {
    notFound();
  }

  const subgroupEntries = Object.entries(subgroupMap);

  return (
    <main className="docs-page">
      <DocsTopbar />
      <div className="docs-shell">
        <nav className="docs-nav">
          <Link href="/" className="docs-back">
            {"<- Home"}
          </Link>
          <span className="docs-sep">/</span>
          <Link href="/v3" className="docs-back">
            V3
          </Link>
        </nav>

        <header className="docs-header">
          <p className="docs-kicker">AWS Certified Solutions Architect - Associate</p>
          <h1 className="docs-title">{parentGroup.name}</h1>
          <p className="docs-subtitle">Select a service to review the detailed notes.</p>
        </header>

        <div className="docs-divider" aria-hidden="true" />

        <section className="docs-section" aria-label="SAA-C03 v3 services">
          <h2 className="docs-section-title">Services</h2>
          <ul className="docs-service-list">
            {subgroupEntries.map(([subgroupSlug, subgroup]) => (
              <li
                key={subgroupSlug}
                className="docs-service-item"
                style={{ "--accent": parentGroup.awsColor } as CSSProperties}
              >
                <Link
                  className="docs-service-link"
                  href={`/v3/sections/${groupSlug}/content/${subgroupSlug}`}
                >
                  <Image
                    src={subgroup.icon}
                    alt={`${subgroup.name} icon`}
                    width={32}
                    height={32}
                    className="docs-service-icon"
                  />
                  <span>{subgroup.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
