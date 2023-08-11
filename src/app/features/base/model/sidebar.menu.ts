export interface SidebarMenu {
  name: string;
  nameSlug?: string;
  menuItems?:{name:string; link?:string}[] | [];
  svgContent?: string;
  icon?: string;
  collapsed?: boolean;
  link?: string;
  subList?: SidebarSubMenu[];
  value?: string
}

export interface SidebarSubMenu {
  name: string;
  link?: string;
}
