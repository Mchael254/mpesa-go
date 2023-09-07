export interface SidebarMenu {
  name: string;
  nameSlug?: string;
  menuItems?:{name:string; link?:string; isModal?: boolean; target?: string}[] | [];
  svgContent?: string;
  icon?: string;
  collapsed?: boolean;
  link?: string;
  subList?: SidebarSubMenu[];
  value?: string,
  isActive?: boolean,
}

export interface SidebarSubMenu {
  name: string;
  link?: string;
}
