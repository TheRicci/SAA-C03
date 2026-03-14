export default function DocsTopbar() {
  return (
    <div className="docs-topbar docs-topbar-tall">
      <div className="docs-topbar-inner docs-topbar-row">
        <div />
        <nav className="docs-topbar-links" aria-label="External resources">
          <a
            href="https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html#saa-03-in-scope-analytics"
            target="_blank"
            rel="noreferrer"
          >
            AWS in-scope services
          </a>
          <a
            href="https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/"
            target="_blank"
            rel="noreferrer"
          >
            Udemy SAA-C03 course
          </a>
          <a
            href="https://tutorialsdojo.com/aws-certified-solutions-architect-associate-saa-c03/"
            target="_blank"
            rel="noreferrer"
          >
            Tutorials Dojo SAA-C03
          </a>
        </nav>
      </div>
    </div>
  );
}
