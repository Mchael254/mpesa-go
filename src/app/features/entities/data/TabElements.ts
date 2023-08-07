import {Pagination} from "../../../shared/data/common/pagination";
import {StaffDto} from "./StaffDto";

export interface TabElements {
  name: string;
  tabLinkId: string;
  ariaControlId: string;
  ariaSelected: string;
  tabPaneId: string;
  lazyLoadMethod: string;
  dataContainer: Pagination<StaffDto>;
  ellipsisDropdownId: string;
}
export interface MainElements {
  activeTab : string;
  subElements: TabElements;
}
