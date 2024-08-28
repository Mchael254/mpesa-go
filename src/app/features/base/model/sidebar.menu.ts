export interface SidebarMenu {
  name: string;
  nameSlug?: string;
  menuItems?:
    | {
        name: string;
        nameSlug?: string;
        link?: string;
        isModal?: boolean;
        target?: string;
        subList?: SidebarSubMenu[];
        collapsed?: boolean;
      }[]
    | [];
  svgContent?: string;
  icon?: string;
  collapsed?: boolean;
  link?: string;
  subList?: SidebarSubMenu[];
  value?: string;
  isActive?: boolean;
}

export interface SidebarSubMenu {
  name: string;
  link?: string;
  subList?: SidebarSubMenu[];
  collapsed?: boolean;
}
