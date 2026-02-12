import { Pages } from "../constants/pages.enum";

export interface MenuItem {
    label: string;
    page: Pages;
    selected: boolean;
}