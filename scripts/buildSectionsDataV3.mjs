import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "app");
const iconsRoot = path.join(root, "Icon-package");
const v2Path = path.join(appDir, "sectionsDataV2.ts");
const v3ContentPath = path.join(root, "data", "section-contentV3.json");
const outPath = path.join(appDir, "sectionsDataV3.ts");

const v3Raw = fs.readFileSync(v3ContentPath, "utf8");
const v3Data = JSON.parse(v3Raw);
const groupOrder = Object.keys(v3Data);

const v2Text = fs.readFileSync(v2Path, "utf8");

const importRegex = /^import (\w+) from "(.+\.png)";$/gm;
const iconVarToPath = new Map();
let match;
while ((match = importRegex.exec(v2Text))) {
  iconVarToPath.set(match[1], match[2]);
}

const groupRegex = /\{ slug: "([^"]+)", name: "([^"]+)", awsColor: "([^"]+)", icon: (\w+) \}/g;
const v2GroupBySlug = new Map();
while ((match = groupRegex.exec(v2Text))) {
  const [slug, name, awsColor, iconVar] = [match[1], match[2], match[3], match[4]];
  const iconPath = iconVarToPath.get(iconVar) ?? null;
  v2GroupBySlug.set(slug, { name, awsColor, iconPath });
}

const subgroupRegex = /"([^"]+)": \{ name: "([^"]+)", awsColor: "([^"]+)", icon: (\w+) \}/g;
const v2SubgroupBySlug = new Map();
while ((match = subgroupRegex.exec(v2Text))) {
  const [slug, name, , iconVar] = [match[1], match[2], match[3], match[4]];
  if (!v2SubgroupBySlug.has(slug)) {
    const iconPath = iconVarToPath.get(iconVar) ?? null;
    v2SubgroupBySlug.set(slug, { name, iconPath });
  }
}

const acronymMap = new Map([
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
  ["api", "API"],
  ["cdn", "CDN"],
  ["ip", "IP"],
  ["dns", "DNS"],
  ["ttl", "TTL"],
  ["mt", "MT"],
]);

const smallWords = new Set(["and", "or", "of", "the", "to", "for", "in", "on", "with", "vs"]);

function titleFromSlug(slug) {
  const parts = slug.split(/[-_]/g);
  return parts
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (acronymMap.has(lower)) {
        return acronymMap.get(lower);
      }
      if (index > 0 && smallWords.has(lower)) {
        return lower;
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function walkDir(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, callback);
    } else {
      callback(full);
    }
  }
}

function toPosixPath(p) {
  return p.replace(/\\/g, "/");
}

function slugFromIconName(fileName) {
  let base = fileName.replace(/\.png$/i, "");
  base = base.replace(/^Arch_/, "");
  base = base.replace(/_64(@5x)?$/, "");
  base = base.replace(/_/g, "-");
  base = base.replace(/--+/g, "-");
  return base.toLowerCase();
}

const serviceIconBySlug = new Map();
const serviceRoot = path.join(iconsRoot, "Architecture-Service-Icons_01302026");
walkDir(serviceRoot, (file) => {
  if (!file.endsWith(".png") || file.includes("@5x")) {
    return;
  }
  const dirName = path.basename(path.dirname(file));
  if (dirName !== "64") {
    return;
  }
  const slug = slugFromIconName(path.basename(file));
  if (!serviceIconBySlug.has(slug)) {
    const rel = toPosixPath(path.relative(appDir, file));
    serviceIconBySlug.set(slug, rel);
  }
});

const categoryIconBySlug = new Map();
const categoryDir = path.join(iconsRoot, "Category-Icons_01302026", "Arch-Category_64");
for (const file of fs.readdirSync(categoryDir)) {
  if (!file.endsWith(".png") || file.includes("@5x")) {
    continue;
  }
  let slug = file.replace(/^Arch-Category_/, "").replace(/_64\.png$/, "");
  slug = slug.replace(/_/g, "-").toLowerCase();
  const full = path.join(categoryDir, file);
  const rel = toPosixPath(path.relative(appDir, full));
  categoryIconBySlug.set(slug, rel);
}

const newGroupOverrides = {
  "vpc-fundamentals": {
    color: "#4C7BD9",
    category: "networking-content-delivery",
  },
  "architecture-patterns": {
    color: "#6B5B95",
    category: "management-tools",
  },
  "disaster-recovery": {
    color: "#2E8B57",
    category: "migration-modernization",
  },
  "cost-optimization": {
    color: "#C87F0A",
    category: "cloud-financial-management",
  },
  "exam-traps-and-numbers": {
    color: "#B44C4C",
    category: "security-identity",
  },
};

function resolveGroupMeta(groupSlug) {
  if (v2GroupBySlug.has(groupSlug)) {
    const fromV2 = v2GroupBySlug.get(groupSlug);
    return {
      name: fromV2.name,
      color: fromV2.awsColor,
      iconPath: fromV2.iconPath,
    };
  }

  const override = newGroupOverrides[groupSlug];
  if (override) {
    const iconPath = categoryIconBySlug.get(override.category) ?? null;
    return {
      name: titleFromSlug(groupSlug),
      color: override.color,
      iconPath,
    };
  }

  const fallbackIcon = categoryIconBySlug.get("management-tools") ?? null;
  return {
    name: titleFromSlug(groupSlug),
    color: "#64748B",
    iconPath: fallbackIcon,
  };
}

function resolveSubgroupMeta(groupSlug, subgroupSlug, groupIconPath, groupColor) {
  const v2 = v2SubgroupBySlug.get(subgroupSlug);
  const name = v2?.name ?? titleFromSlug(subgroupSlug);
  const iconPath = serviceIconBySlug.get(subgroupSlug) ?? groupIconPath;
  return {
    name,
    iconPath,
    color: groupColor,
  };
}

const allIconPaths = new Map();
function iconVarName(iconPath) {
  const cleaned = iconPath
    .replace(/\.png$/, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `icon${cleaned}`;
}

const groups = [];
const subgroupsByGroup = {};

for (const groupSlug of groupOrder) {
  const groupMeta = resolveGroupMeta(groupSlug);
  if (!groupMeta.iconPath) {
    throw new Error(`Missing icon path for group ${groupSlug}`);
  }
  const groupIconVar = iconVarName(groupMeta.iconPath);
  allIconPaths.set(groupMeta.iconPath, groupIconVar);

  groups.push({
    slug: groupSlug,
    name: groupMeta.name,
    awsColor: groupMeta.color,
    iconVar: groupIconVar,
  });

  const subgroupEntries = v3Data[groupSlug] ?? {};
  const subgroupOrder = Object.keys(subgroupEntries);
  const subgroupMap = {};

  for (const subgroupSlug of subgroupOrder) {
    const subgroupMeta = resolveSubgroupMeta(
      groupSlug,
      subgroupSlug,
      groupMeta.iconPath,
      groupMeta.color
    );
    if (!subgroupMeta.iconPath) {
      throw new Error(`Missing icon path for subgroup ${subgroupSlug}`);
    }
    const subgroupIconVar = iconVarName(subgroupMeta.iconPath);
    allIconPaths.set(subgroupMeta.iconPath, subgroupIconVar);

    subgroupMap[subgroupSlug] = {
      name: subgroupMeta.name,
      awsColor: subgroupMeta.color,
      iconVar: subgroupIconVar,
    };
  }

  subgroupsByGroup[groupSlug] = subgroupMap;
}

const importLines = [...allIconPaths.entries()]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([iconPath, varName]) => `import ${varName} from "${iconPath}";`)
  .join("\n");

const groupLines = groups
  .map(
    (group) =>
      `  { slug: "${group.slug}", name: "${group.name}", awsColor: "${group.awsColor}", icon: ${group.iconVar} },`
  )
  .join("\n");

const subgroupLines = Object.entries(subgroupsByGroup)
  .map(([groupSlug, subgroupMap]) => {
    const items = Object.entries(subgroupMap)
      .map(
        ([slug, meta]) =>
          `    "${slug}": { name: "${meta.name}", awsColor: "${meta.awsColor}", icon: ${meta.iconVar} },`
      )
      .join("\n");
    return `  "${groupSlug}": {\n${items}\n  },`;
  })
  .join("\n");

const output = `import type { StaticImageData } from "next/image";\n\n${importLines}\n\nexport type V3Group = {\n  slug: string;\n  name: string;\n  awsColor: string;\n  icon: StaticImageData;\n};\n\nexport type V3Subgroup = {\n  name: string;\n  awsColor: string;\n  icon: StaticImageData;\n};\n\nexport type V3SubgroupMap = Record<string, V3Subgroup>;\nexport type V3SubgroupsByGroupSlug = Record<string, V3SubgroupMap>;\n\nexport const v3Groups: V3Group[] = [\n${groupLines}\n];\n\nexport const v3GroupsBySlug: Record<string, V3Group> = Object.fromEntries(\n  v3Groups.map((group) => [group.slug, group])\n) as Record<string, V3Group>;\n\nexport const v3SubgroupsByGroupSlug: V3SubgroupsByGroupSlug = {\n${subgroupLines}\n};\n\nexport function getV3GroupBySlug(slug: string): V3Group | undefined {\n  return v3GroupsBySlug[slug];\n}\n\nexport function getV3SubgroupMapByGroupSlug(groupSlug: string): V3SubgroupMap {\n  return v3SubgroupsByGroupSlug[groupSlug] ?? {};\n}\n\nexport function getV3SubgroupBySlugs(groupSlug: string, subgroupSlug: string): V3Subgroup | undefined {\n  const subgroups = getV3SubgroupMapByGroupSlug(groupSlug);\n  return subgroups[subgroupSlug];\n}\n`;

fs.writeFileSync(outPath, output, "utf8");
console.log(`Wrote ${outPath}`);