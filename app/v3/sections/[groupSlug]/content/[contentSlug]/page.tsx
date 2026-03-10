import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import type { CSSProperties } from "react";

import {
  getV3GroupBySlug,
  getV3SubgroupBySlugs,
  getV3SubgroupMapByGroupSlug,
} from "../../../../../sectionsDataV3";

type ContentBlock = {
  part: string | number;
  text: string;
};

type ContentByGroupMap = Record<string, Record<string, ContentBlock[]>>;
type GroupColorStyle = CSSProperties & { "--group-color": string };

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
  const panelStyle: GroupColorStyle = { "--group-color": currentSubgroup.awsColor };

  return (
    <main className="section-shell">
      <Link href={`/v3/sections/${groupSlug}`} className="back-link">
        {"<- Back to group"}
      </Link>

      <article className="section-panel" style={panelStyle}>
        <div className="section-top-border" aria-hidden="true" />

        <header className="section-header">
          <Image
            src={currentSubgroup.icon}
            alt={`${currentSubgroup.name} category icon`}
            width={56}
            height={56}
            className="section-title-icon"
          />
          <div>
            <p className="section-kicker">{parentGroup.name}</p>
            <h1>{currentSubgroup.name}</h1>
          </div>
        </header>

        <section className="section-content">
          <h2>Section Content</h2>
          <div className="content-block-list">
            {contentBlocks.length > 0 ? (
              contentBlocks.map((block, index) => (
                <article
                  key={`${contentSlug}-${String(block.part)}-${index}`}
                  className="content-block"
                >
                  <h3>{block.part}</h3>
                  <p className="content-block-text">{block.text}</p>
                </article>
              ))
            ) : (
              <article className="content-block">
                <h3>No content yet</h3>
                <p className="content-block-text">
                  Content for this service will be added soon.
                </p>
              </article>
            )}
          </div>
        </section>

        <nav className="section-nav" aria-label="Section navigation">
          <div>
            {previousSubgroupSlug && previousSubgroup ? (
              <Link
                className="section-nav-link"
                href={`/v3/sections/${groupSlug}/content/${previousSubgroupSlug}`}
              >
                Previous: {previousSubgroup.name}
              </Link>
            ) : null}
          </div>
          <div>
            {nextSubgroupSlug && nextSubgroup ? (
              <Link
                className="section-nav-link"
                href={`/v3/sections/${groupSlug}/content/${nextSubgroupSlug}`}
              >
                Next: {nextSubgroup.name}
              </Link>
            ) : null}
          </div>
        </nav>
      </article>
    </main>
  );
}
