import { Component, Input } from '@angular/core';

interface SidebarSection {
  title: string;
  links: { label: string; url?: string }[];
}

@Component({
  selector: 'app-sidebar-navigation',
  templateUrl: './sidebar-navigation.component.html',
  styleUrls: ['./sidebar-navigation.component.css']
})
export class SidebarNavigationComponent {
  @Input() sections: SidebarSection[] = [];
}
