import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  TrendingUp,
  MapPinned,
  Map as MapIcon,
  Zap,
  FileBarChart2,
  Bolt,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const nav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Demand Forecasting", url: "/forecasting", icon: TrendingUp },
  { title: "Station Placement", url: "/placement", icon: MapPinned },
  { title: "GIS Map", url: "/map", icon: MapIcon },
  { title: "Charging Stations", url: "/stations", icon: Zap },
  { title: "Reports & Analytics", url: "/reports", icon: FileBarChart2 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--color-primary)]">
            <Bolt className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-sidebar-foreground">VoltGrid AI</div>
              <div className="truncate text-[11px] text-muted-foreground">Smart EV Placement</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Control Center</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-2 py-2 text-[11px] text-muted-foreground">
            Model: <span className="text-primary">XGBoost v1.4</span> · R² 0.943
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
