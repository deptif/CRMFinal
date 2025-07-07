
import { useSidebar } from '@/components/ui/sidebar';
import {
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { MenuGroup } from './MenuConfig';

interface SidebarGroupProps {
  group: MenuGroup;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const SidebarGroup = ({ group, activeSection, onSectionChange }: SidebarGroupProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    window.history.pushState({}, '', `/?section=${section}`);
  };

  return (
    <ShadcnSidebarGroup>
      {!isCollapsed && (
        <SidebarGroupLabel className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase px-2 pb-2">
          {group.title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const isActive = activeSection === item.section;
            const IconComponent = item.icon;
            return (
              <SidebarMenuItem key={item.name} className="rounded-md">
                <div className="relative">
                  <SidebarMenuButton
                    onClick={() => handleSectionChange(item.section)}
                    isActive={isActive}
                    tooltip={isCollapsed ? item.name : undefined}
                    className="w-full"
                  >
                    <IconComponent className="h-5 w-5" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </SidebarMenuButton>
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-200" />
                  )}
                </div>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </ShadcnSidebarGroup>
  );
};
