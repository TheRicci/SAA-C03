import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";

import {
  getV3GroupBySlug,
  getV3SubgroupBySlugs,
  getV3SubgroupMapByGroupSlug,
} from "../../../../../sectionsDataV3";
import DocsTopbar from "../../../../../components/DocsTopbar";

type ContentBlock = {
  part: string | number;
  text: string;
};

type ContentByGroupMap = Record<string, Record<string, ContentBlock[]>>;

function isContentBlock(value: unknown): value is ContentBlock {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const part = Reflect.get(value, "part");
  const text = Reflect.get(value, "text");
  const hasValidPart = typeof part === "string" || typeof part === "number";

  return hasValidPart && typeof text === "string";
}

function isContentByGroupMap(value: unknown): value is ContentByGroupMap {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.values(value).every((groupEntry) => {
    if (typeof groupEntry !== "object" || groupEntry === null) {
      return false;
    }

    return Object.values(groupEntry).every((entry) => {
      return Array.isArray(entry) && entry.every(isContentBlock);
    });
  });
}

async function loadContentByGroupMap(): Promise<ContentByGroupMap> {
  const contentPath = path.join(process.cwd(), "data", "section-contentV3.json");
  const raw = await fs.readFile(contentPath, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!isContentByGroupMap(parsed)) {
    return {};
  }

  return parsed;
}

type ContentPageProps = {
  params: Promise<{ groupSlug: string; contentSlug: string }>;
};

export default async function ContentPage({ params }: ContentPageProps) {
  const { groupSlug, contentSlug } = await params;

  const parentGroup = getV3GroupBySlug(groupSlug);
  if (!parentGroup) {
    notFound();
  }

  const currentSubgroup = getV3SubgroupBySlugs(groupSlug, contentSlug);
  if (!currentSubgroup) {
    notFound();
  }

  const subgroupMap = getV3SubgroupMapByGroupSlug(groupSlug);
  const subgroupSlugs = Object.keys(subgroupMap);
  const currentIndex = subgroupSlugs.findIndex((slug) => slug === contentSlug);

  if (currentIndex === -1) {
    notFound();
  }

  const previousSubgroupSlug =
    currentIndex > 0 ? (subgroupSlugs[currentIndex - 1] ?? null) : null;
  const nextSubgroupSlug =
    currentIndex < subgroupSlugs.length - 1 ? (subgroupSlugs[currentIndex + 1] ?? null) : null;

  const previousSubgroup = previousSubgroupSlug
    ? (subgroupMap[previousSubgroupSlug] ?? null)
    : null;
  const nextSubgroup = nextSubgroupSlug ? (subgroupMap[nextSubgroupSlug] ?? null) : null;

  const contentByGroupMap = await loadContentByGroupMap();
  const contentBlocks = contentByGroupMap[groupSlug]?.[contentSlug] ?? [];
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
          <span className="docs-sep">/</span>
          <Link href={`/v3/sections/${groupSlug}`} className="docs-back">
            {parentGroup.name}
          </Link>
        </nav>

        <header className="docs-header docs-header-row">
          <Image
            src={currentSubgroup.icon}
            alt={`${currentSubgroup.name} icon`}
            width={40}
            height={40}
            className="docs-icon"
          />
          <div>
            <p className="docs-kicker">{parentGroup.name}</p>
            <h1 className="docs-title">{currentSubgroup.name}</h1>
          </div>
        </header>

        <div className="docs-divider" aria-hidden="true" />

        <section className="docs-section">
          <h2 className="docs-section-title">Notes</h2>
          <div className="docs-block-list">
            {contentBlocks.length > 0 ? (
              contentBlocks.map((block, index) => (
                <article key={`${contentSlug}-${String(block.part)}-${index}`} className="docs-block">
                  <h3>{block.part}</h3>
                  <p>{block.text}</p>
                </article>
              ))
            ) : (
              <article className="docs-block">
                <h3>No content yet</h3>
                <p>Content for this service will be added soon.</p>
              </article>
            )}
          </div>
        </section>

        <nav className="docs-pager" aria-label="Section navigation">
          <div>
            {previousSubgroupSlug && previousSubgroup ? (
              <Link
                className="docs-pager-link"
                href={`/v3/sections/${groupSlug}/content/${previousSubgroupSlug}`}
              >
                Previous: {previousSubgroup.name}
              </Link>
            ) : null}
          </div>
          <div>
            {nextSubgroupSlug && nextSubgroup ? (
              <Link
                className="docs-pager-link"
                href={`/v3/sections/${groupSlug}/content/${nextSubgroupSlug}`}
              >
                Next: {nextSubgroup.name}
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </main>
  );
}
