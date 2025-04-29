import { Component } from '@angular/core';

@Component({
  selector: 'app-tracks-page',
  imports: [],
  templateUrl: './tracks-page.component.html',
  styleUrl: './tracks-page.component.css'
})
export class TracksPageComponent {
  sectionsData = [
    {
      title: '9 Months',
      links: [
        { label: 'Open Source Applications Development' },
        { label: 'Telecom Applications Development' },
        { label: 'Cloud Platform Development' },
        { label: 'Software Engineering & Development' },
        { label: 'Infrastructure, Networks & Cybersecurity' },
        { label: 'Data & Information Systems' },
        { label: 'AI & Cognitive Computing' },
        { label: 'QA & Testing' },
        { label: 'Industrial & Embedded Systems' },
        { label: 'Digital Arts & Media' },
      ]
    },
    {
      title: '4 Months',
      links: [
        { label: 'Coming Soon' }
      ]
    }
  ];
}

