import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

import { pdfSectionGroups } from "./sectionsData";

type GroupColorStyle = CSSProperties & { "--group-color": string };

export default function Page() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="kicker">AWS Certified Solutions Architect - Associate</p>
        <h1>SAA-C03 Study Map</h1>
        <p>Each card opens a dedicated section page with clean, focused study points.</p>
      </section>

      <section className="group-grid" aria-label="SAA-C03 study sections">
        {pdfSectionGroups.map((group) => (
          <Link key={group.slug} className="group-link" href={`/sections/${group.slug}`}>
            <article
              className="group-card"
              style={{ "--group-color": group.awsColor } as GroupColorStyle}
            >
              <div className="group-color" aria-hidden="true" />
              <div className="group-content">
                <div className="group-heading">
                  <Image
                    src={group.icon}
                    alt={`${group.name} category icon`}
                    width={38}
                    height={38}
                    className="group-icon"
                  />
                  <h2>{group.name}</h2>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
