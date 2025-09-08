import { BreadcrumbItem } from "@/components/Breadcrumbs";
import { ScenarioData } from "@/shared/models";
import { SessionData } from "@/session/session";
import { useRouter } from "next/router";

type UseBreadcrumbsProps = {
  scenario?: ScenarioData;
  session?: SessionData;
};

export const useBreadcrumbs = ({ scenario, session }: UseBreadcrumbsProps = {}) => {
  const router = useRouter();
  const { pathname, query } = router;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
    },
  ];

  // Add scenarios breadcrumb if we're on any scenarios page
  if (pathname.startsWith("/scenarios")) {
    breadcrumbs.push({
      label: "Scenarios",
      href: "/scenarios",
    });

    // Add specific scenario breadcrumb if we have scenario data
    if (scenario && query.scenario_id) {
      breadcrumbs.push({
        label: scenario.name,
        href: `/scenarios/${scenario.id}`,
      });

      // Add session breadcrumb if we have session data
      if (session && query.session_id) {
        breadcrumbs.push({
          label: `${session.id}`,
          isCurrent: true,
        });
      } else {
        // We're on the scenario page, mark it as current
        breadcrumbs[breadcrumbs.length - 1].isCurrent = true;
      }
    } else {
      // We're on the scenarios index page, mark it as current
      breadcrumbs[breadcrumbs.length - 1].isCurrent = true;
    }
  } else {
    // We're on the home page, mark it as current
    breadcrumbs[0].isCurrent = true;
  }

  return breadcrumbs;
};
