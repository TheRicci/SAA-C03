"use client";

import { useMemo, useState } from "react";

const domains = [
  {
    id: "compute",
    label: "Processing",
    color: "#f7981f",
    overview: "Design resilient compute across VM, containers, and serverless.",
    services: [
      {
        name: "EC2 + Auto Scaling",
        summary: "Baseline compute with predictable performance and scaling policies.",
        examFocus: [
          "Launch templates and mixed instance policies",
          "Health checks and replacement behavior",
          "Placement groups for throughput vs latency"
        ],
        topics: [
          {
            title: "High Availability",
            details: "Use multi-AZ auto scaling groups and avoid single-instance designs in production scenarios."
          },
          {
            title: "Cost Strategy",
            details: "Combine Savings Plans and Spot with on-demand fallback when workload is interruption-sensitive."
          }
        ]
      },
      {
        name: "Lambda",
        summary: "Event-driven compute for bursty workloads and integrations.",
        examFocus: [
          "Concurrency controls and throttling",
          "Cold starts and runtime selection",
          "VPC networking impact on execution"
        ],
        topics: [
          {
            title: "Scaling Model",
            details: "Lambda scales per event source; understand reserved concurrency and account limits."
          },
          {
            title: "Observability",
            details: "Use CloudWatch logs and metrics to tune timeout, memory, and retries."
          }
        ]
      }
    ]
  },
  {
    id: "storage",
    label: "Storage",
    color: "#3f8624",
    overview: "Choose object, block, and file storage by access pattern and durability goals.",
    services: [
      {
        name: "S3",
        summary: "Durable object storage with lifecycle and tiering options.",
        examFocus: [
          "Storage classes and lifecycle transitions",
          "Cross-Region Replication and versioning",
          "Block Public Access and bucket policies"
        ],
        topics: [
          {
            title: "Data Protection",
            details: "MFA delete, versioning, and replication address accidental deletion and regional events."
          },
          {
            title: "Performance",
            details: "Use multipart upload and Transfer Acceleration for large global uploads."
          }
        ]
      },
      {
        name: "EBS / EFS / FSx",
        summary: "Persistent storage for EC2 and shared file workloads.",
        examFocus: [
          "IOPS vs throughput tradeoffs",
          "Snapshot and restore strategy",
          "Shared file use cases vs block storage"
        ],
        topics: [
          {
            title: "EBS",
            details: "Single-AZ block volumes for low-latency attach to instances."
          },
          {
            title: "EFS",
            details: "Elastic NFS storage for multi-AZ shared Linux workloads."
          }
        ]
      }
    ]
  },
  {
    id: "identity",
    label: "IAM & Security",
    color: "#dd344c",
    overview: "Secure access with least privilege, encryption, and auditability.",
    services: [
      {
        name: "IAM",
        summary: "Core identity and authorization controls for AWS resources.",
        examFocus: [
          "Policy evaluation logic",
          "Roles vs users and temporary credentials",
          "Permission boundaries and SCP interactions"
        ],
        topics: [
          {
            title: "Least Privilege",
            details: "Prefer roles and scoped policies; avoid wildcard actions/resources unless justified."
          },
          {
            title: "Cross Account Access",
            details: "Use trust policies and assume-role for secure delegation."
          }
        ]
      },
      {
        name: "KMS + Secrets Manager",
        summary: "Centralized key management and application secret lifecycle.",
        examFocus: [
          "Envelope encryption",
          "CMK rotation strategy",
          "Automatic secret rotation patterns"
        ],
        topics: [
          {
            title: "Encryption Choices",
            details: "Use KMS-managed keys for service integration and control auditing through CloudTrail."
          },
          {
            title: "Secrets Retrieval",
            details: "Cache retrieved secrets in apps to reduce latency and API costs."
          }
        ]
      }
    ]
  },
  {
    id: "networking",
    label: "Networking",
    color: "#4b82c3",
    overview: "Design secure, scalable connectivity and traffic routing.",
    services: [
      {
        name: "VPC",
        summary: "Foundation network segmentation with route and security controls.",
        examFocus: [
          "Public vs private subnet routing",
          "NACL vs security group behavior",
          "NAT gateway and endpoint use"
        ],
        topics: [
          {
            title: "Connectivity",
            details: "Use VPC peering/Transit Gateway by topology and transitivity requirements."
          },
          {
            title: "Private Access",
            details: "Gateway and interface endpoints reduce public internet dependency."
          }
        ]
      },
      {
        name: "Route 53 + Elastic Load Balancing",
        summary: "Global DNS and traffic distribution across healthy targets.",
        examFocus: [
          "Routing policies and failover",
          "ALB vs NLB decision points",
          "Health checks and weighted migrations"
        ],
        topics: [
          {
            title: "Global Resiliency",
            details: "Use failover and latency routing to improve user experience and availability."
          },
          {
            title: "Progressive Delivery",
            details: "Weighted records plus target groups allow safer phased rollouts."
          }
        ]
      }
    ]
  }
];

export default function Page() {
  const [activeDomain, setActiveDomain] = useState(domains[0].id);
  const [activeService, setActiveService] = useState(0);

  const selectedDomain = useMemo(
    () => domains.find((domain) => domain.id === activeDomain) || domains[0],
    [activeDomain]
  );

  const selectedService = selectedDomain.services[activeService] || selectedDomain.services[0];

  return (
    <main className="page-shell">
      <section className="hero card">
        <p className="kicker">AWS SAA-C03</p>
        <h1>Architecture Study Map</h1>
        <p>
          Start with domain overviews, then click into services to review exam-focused concepts,
          decision criteria, and common scenario patterns.
        </p>
      </section>

      <section className="domain-grid">
        {domains.map((domain) => {
          const isActive = domain.id === selectedDomain.id;
          return (
            <button
              key={domain.id}
              className={`domain-card ${isActive ? "is-active" : ""}`}
              style={{ "--domain": domain.color }}
              onClick={() => {
                setActiveDomain(domain.id);
                setActiveService(0);
              }}
            >
              <span className="domain-label">{domain.label}</span>
              <span className="domain-overview">{domain.overview}</span>
              <span className="domain-meta">{domain.services.length} core service groups</span>
            </button>
          );
        })}
      </section>

      <section className="detail-layout">
        <article className="service-list card" style={{ "--domain": selectedDomain.color }}>
          <h2>{selectedDomain.label}</h2>
          <p>{selectedDomain.overview}</p>
          <div className="service-buttons">
            {selectedDomain.services.map((service, index) => (
              <button
                key={service.name}
                className={index === activeService ? "service-button selected" : "service-button"}
                onClick={() => setActiveService(index)}
              >
                {service.name}
              </button>
            ))}
          </div>
        </article>

        <article className="service-detail card" style={{ "--domain": selectedDomain.color }}>
          <h3>{selectedService.name}</h3>
          <p className="service-summary">{selectedService.summary}</p>

          <h4>Exam Focus</h4>
          <ul>
            {selectedService.examFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h4>Deep Dive</h4>
          <div className="topic-grid">
            {selectedService.topics.map((topic) => (
              <div key={topic.title} className="topic-card">
                <strong>{topic.title}</strong>
                <p>{topic.details}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}