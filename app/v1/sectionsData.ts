import type { StaticImageData } from "next/image";

import analyticsIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Analytics_64.png";
import applicationIntegrationIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Application-Integration_64.png";
import artificialIntelligenceIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Artificial-Intelligence_64.png";
import businessApplicationsIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Business-Applications_64.png";
import computeIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Compute_64.png";
import containersIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Containers_64.png";
import customerEnablementIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Customer-Enablement_64.png";
import customerExperienceIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Customer-Experience_64.png";
import databasesIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Databases_64.png";
import managementToolsIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Management-Tools_64.png";
import migrationModernizationIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Migration-Modernization_64.png";
import networkingIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Networking-Content-Delivery_64.png";
import securityIdentityIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Security-Identity_64.png";
import serverlessIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Serverless_64.png";
import storageIcon from "../../Icon-package/Category-Icons_01302026/Arch-Category_64/Arch-Category_Storage_64.png";

export type LegacySectionGroup = {
  slug: string;
  name: string;
  awsColor: string;
  icon: StaticImageData;
};

export const pdfSectionGroups: LegacySectionGroup[] = [
  //{ slug: "getting-started-with-aws", name: "Getting Started with AWS", awsColor: "#C925D1", icon: customerEnablementIcon },
  { slug: "aws-identity-access-management-iam", name: "AWS Identity & Access Management (AWS IAM)", awsColor: "#DD344C", icon: securityIdentityIcon },
  { slug: "amazon-ec2-basics", name: "Amazon EC2 - Basics", awsColor: "#ED7100", icon: computeIcon },
  { slug: "amazon-ec2-associate", name: "Amazon EC2 - Associate", awsColor: "#ED7100", icon: computeIcon },
  { slug: "amazon-ec2-instance-storage", name: "Amazon EC2 - Instance Storage", awsColor: "#ED7100", icon: computeIcon },
  { slug: "high-availability-scalability", name: "High Availability & Scalability", awsColor: "#8C4FFF", icon: networkingIcon },
  { slug: "rds-aurora-elasticache", name: "RDS, Aurora & ElastiCache", awsColor: "#C925D1", icon: databasesIcon },
  { slug: "amazon-route-53", name: "Amazon Route 53", awsColor: "#8C4FFF", icon: networkingIcon },
  //{ slug: "classic-solutions-architecture", name: "Classic Solutions Architecture", awsColor: "#E7157B", icon: managementToolsIcon },
  { slug: "amazon-s3", name: "Amazon S3", awsColor: "#7AA116", icon: storageIcon },
  { slug: "amazon-s3-advanced", name: "Amazon S3 - Advanced", awsColor: "#7AA116", icon: storageIcon },
  { slug: "amazon-s3-security", name: "Amazon S3 - Security", awsColor: "#7AA116", icon: storageIcon },
  { slug: "cloudfront-global-accelerator", name: "CloudFront & Global Accelerator", awsColor: "#8C4FFF", icon: networkingIcon },
  { slug: "aws-storage-extras", name: "AWS Storage Extras", awsColor: "#7AA116", icon: storageIcon },
  { slug: "aws-integration-messaging", name: "AWS Integration & Messaging", awsColor: "#E7157B", icon: applicationIntegrationIcon },
  { slug: "containers-on-aws", name: "Containers on AWS", awsColor: "#ED7100", icon: containersIcon },
  { slug: "serverless-overview", name: "Serverless Overview", awsColor: "#8C4FFF", icon: serverlessIcon },
  //{ slug: "serverless-architectures", name: "Serverless Architectures", awsColor: "#8C4FFF", icon: serverlessIcon },
  { slug: "databases-in-aws", name: "Databases in AWS", awsColor: "#C925D1", icon: databasesIcon },
  { slug: "data-analytics", name: "Data & Analytics", awsColor: "#8C4FFF", icon: analyticsIcon },
  { slug: "machine-learning", name: "Machine Learning", awsColor: "#01A88D", icon: artificialIntelligenceIcon },
  { slug: "aws-monitoring-audit-performance", name: "AWS Monitoring, Audit & Performance", awsColor: "#E7157B", icon: managementToolsIcon },
  { slug: "advanced-identity-in-aws", name: "Advanced Identity in AWS", awsColor: "#DD344C", icon: securityIdentityIcon },
  { slug: "aws-security-encryption", name: "AWS Security & Encryption", awsColor: "#DD344C", icon: securityIdentityIcon },
  { slug: "amazon-vpc", name: "Amazon VPC", awsColor: "#8C4FFF", icon: networkingIcon },
  { slug: "disaster-recovery-migrations", name: "Disaster Recovery & Migrations", awsColor: "#01A88D", icon: migrationModernizationIcon },
  //{ slug: "more-solutions-architecture", name: "More Solutions Architecture", awsColor: "#E7157B", icon: managementToolsIcon },
  { slug: "other-services", name: "Other Services", awsColor: "#DD344C", icon: businessApplicationsIcon },
  { slug: "white-papers-architectures", name: "White Papers & Architectures", awsColor: "#E7157B", icon: managementToolsIcon },
  //{ slug: "exam-preparation", name: "Exam Preparation", awsColor: "#C925D1", icon: customerEnablementIcon },
];

export function getSectionBySlug(slug: string): LegacySectionGroup | undefined {
  return pdfSectionGroups.find((section) => section.slug === slug);
}
