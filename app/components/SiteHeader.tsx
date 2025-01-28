import React from "react";
import { Link, type UIMatch } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

function SiteHeader({
  breadcrumbs,
}: {
  breadcrumbs: UIMatch<
    unknown,
    {
      breadcrumb: (
        matches: UIMatch<unknown, unknown>
      ) => { href?: string; title: string } | { href?: string; title: string }[];
    }
  >[];
}) {
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      role="banner"
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map<React.ReactNode>((match, index) => {
                const result = match.handle.breadcrumb(match);
                const crumbs = Array.isArray(result) ? result : [result];
                const nodes: React.ReactNode[] = [];
                for (const crumb of crumbs) {
                  if (crumb.href) {
                    nodes.push(
                      <BreadcrumbLink key={crumb.title} asChild>
                        <Link to={crumb.href}>{crumb.title}</Link>
                      </BreadcrumbLink>
                    );
                  } else {
                    nodes.push(<BreadcrumbItem key={crumb.title}>{crumb.title}</BreadcrumbItem>);
                  }
                  nodes.push(<BreadcrumbSeparator key={`${crumb.title}-after`} />);
                }
                if (index + 1 >= breadcrumbs.length) {
                  nodes.pop();
                }
                return nodes;
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
