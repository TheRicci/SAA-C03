import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import {
  getExamSubgroupMapByGroupSlug,
  getExamGroupBySlug,
} from "../../sectionsDataV2";

type GroupColorStyle = CSSProperties & { "--group-color": string };
type GroupPageProps = {
  params: Promise<{ groupSlug: string }>;
};

export default async function Page({ params }: GroupPageProps) {
  const { groupSlug } = await params;
  const subgroupMap = getExamSubgroupMapByGroupSlug(groupSlug);
  const parentGroup = getExamGroupBySlug(groupSlug);

  if (!parentGroup) {
    notFound();
  }

  const subgroupEntries = Object.entries(subgroupMap);
  console.log(subgroupMap);
  console.log(subgroupEntries);
  
  return (
    <main className="shell">
      <Link href="/" className="back-link">
        {"<- Back to home"}
      </Link>
      <section className="intro">
        <p className="kicker">AWS Certified Solutions Architect - Associate</p>
        <h1>{parentGroup.name}</h1>
        <p>Each card opens a dedicated section page with clean, focused study points.</p>
      </section>

      <section className="group-grid" aria-label="SAA-C03 study sections">
        {subgroupEntries.map(([subgroupSlug, subgroup]) => (
          <Link
            key={subgroupSlug}
            className="group-link"
            href={`/sections/${groupSlug}/content/${subgroupSlug}`}
          >
            <article
              className="group-card"
              style={{ "--group-color": subgroup.awsColor } as GroupColorStyle}
            >
              <div className="group-color" aria-hidden="true" />
              <div className="group-content">
                <div className="group-heading">
                  <Image
                    src={subgroup.icon}
                    alt={`${subgroup.name} category icon`}
                    width={38}
                    height={38}
                    className="group-icon"
                  />
                  <h2>{subgroup.name}</h2>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
