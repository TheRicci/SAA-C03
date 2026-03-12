import fs from "node:fs/promises";
import path from "node:path";
import type { StaticImageData } from "next/image";
import type { Metadata } from "next";

import { getExamGroupBySlug, getExamSubgroupBySlugs } from "../sectionsDataV2";
import CheatsheetGrid, { type CheatsheetGroup, type CheatsheetCard } from "./CheatsheetGrid";
import defaultGroupIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Management-Tools_64.png";

export const metadata: Metadata = {
  title: "SAA-C03 Cheat Sheet",
  description: "Flip-card cheat sheet for SAA-C03 services",
};

type CheatsheetEntry = {
  what: string;
  key: string[];
  trap: string[];
  when: string;
};

type CheatsheetGroupMap = Record<string, CheatsheetEntry>;

type CheatsheetData = Record<string, CheatsheetGroupMap>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isCheatsheetEntry(value: unknown): value is CheatsheetEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const what = Reflect.get(value, "what");
  const key = Reflect.get(value, "key");
  const trap = Reflect.get(value, "trap");
  const when = Reflect.get(value, "when");

  return (
    typeof what === "string" &&
    isStringArray(key) &&
    isStringArray(trap) &&
    typeof when === "string"
  );
}

function isCheatsheetData(value: unknown): value is CheatsheetData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return Object.values(value).every((groupEntry) => {
    if (typeof groupEntry !== "object" || groupEntry === null) {
      return false;
    }

    return Object.values(groupEntry).every(isCheatsheetEntry);
  });
}

async function loadCheatsheetData(): Promise<CheatsheetData> {
  const contentPath = path.join(process.cwd(), "data", "cheatsheet-content.json");
  const raw = await fs.readFile(contentPath, "utf8");
  const parsed: unknown = JSON.parse(raw);

  if (!isCheatsheetData(parsed)) {
    return {};
  }

  return parsed;
}

const acronymMap = new Map<string, string>([
  ["aws", "AWS"],
  ["vpc", "VPC"],
  ["ec2", "EC2"],
  ["s3", "S3"],
  ["iam", "IAM"],
  ["kms", "KMS"],
  ["rds", "RDS"],
  ["ebs", "EBS"],
  ["efs", "EFS"],
  ["sns", "SNS"],
  ["sqs", "SQS"],
  ["elb", "ELB"],
  ["alb", "ALB"],
  ["nlb", "NLB"],
  ["api", "API"],
  ["cdn", "CDN"],
  ["ip", "IP"],
  ["dns", "DNS"],
  ["ttl", "TTL"],
  ["eks", "EKS"],
  ["ecs", "ECS"],
  ["ecr", "ECR"],
  ["msk", "MSK"],
]);

const smallWords = new Set(["and", "or", "of", "the", "to", "for", "in", "on", "with", "vs"]);

function titleFromSlug(slug: string): string {
  const parts = slug.split(/[-_]/g);
  return parts
    .map((part, index) => {
      const lower = part.toLowerCase();
      const acronym = acronymMap.get(lower);
      if (acronym) {
        return acronym;
      }
      if (index > 0 && smallWords.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function buildGroups(data: CheatsheetData): CheatsheetGroup[] {
  return Object.entries(data).map(([groupSlug, services]) => {
    const groupMeta = getExamGroupBySlug(groupSlug);
    const groupName = groupMeta?.name ?? titleFromSlug(groupSlug);
    const groupColor = groupMeta?.awsColor ?? "#64748B";
    const groupIcon: StaticImageData = groupMeta?.icon ?? defaultGroupIcon;

    const cards: CheatsheetCard[] = Object.entries(services).map(([serviceSlug, entry]) => {
      const serviceMeta = getExamSubgroupBySlugs(groupSlug, serviceSlug);
      const serviceName = serviceMeta?.name ?? titleFromSlug(serviceSlug);
      const icon = serviceMeta?.icon ?? groupIcon;

      return {
        id: `${groupSlug}-${serviceSlug}`,
        serviceName,
        icon,
        groupColor,
        what: entry.what,
        keyPoints: entry.key,
        trapPoints: entry.trap,
        when: entry.when,
      };
    });

    return {
      slug: groupSlug,
      name: groupName,
      color: groupColor,
      cards,
    };
  });
}

export default async function CheatsheetPage() {
  const data = await loadCheatsheetData();
  const groups = buildGroups(data);

  return <CheatsheetGrid groups={groups} />;
}
