import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

import cheatSheetIcon from "../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Management-Tools_64.png";
import v3Icon from "../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Analytics_64.png";

type ChoiceStyle = CSSProperties & { "--group-color": string };

const versionChoices = [
  {
    slug: "cheatsheet",
    name: "Cheat Sheet",
    description: "Flip-card review mode across all services.",
    color: "#4C7BD9",
    icon: cheatSheetIcon,
  },
  {
    slug: "v3",
    name: "Version 3",
    description: "Updated groups and deeper subtopics from the v3 dataset.",
    color: "#C87F0A",
    icon: v3Icon,
  },
];

export default function Page() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="kicker">AWS Certified Solutions Architect - Associate</p>
        <h1>SAA-C03 Study Map</h1>
        <p>Select your study mode.</p>
      </section>

      <section className="group-grid" aria-label="SAA-C03 content versions">
        {versionChoices.map((choice) => (
          <Link key={choice.slug} className="group-link" href={`/${choice.slug}`}>
            <article
              className="group-card"
              style={{ "--group-color": choice.color } as ChoiceStyle}
            >
              <div className="group-color" aria-hidden="true" />
              <div className="group-content">
                <div className="group-heading">
                  <Image
                    src={choice.icon}
                    alt={`${choice.name} category icon`}
                    width={38}
                    height={38}
                    className="group-icon"
                  />
                  <div>
                    <h2>{choice.name}</h2>
                    <p className="kicker" style={{ marginTop: "0.3rem" }}>
                      {choice.description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
