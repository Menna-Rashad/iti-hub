import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'; // Add this import

interface Resource {
  name: string;
  url: string;
}

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule], // Add MatIconModule here
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent {
  steps: string[] = [
    'Fill in personal data and upload documents',
    'Acceptance exams (IQ - IT Basics - English)',
    'Interview via MS Teams (Formal dress code required)',
    'Final interview',
    'Final result: Accepted / Not Selected'
  ];

  documents: string[] = [
    'Graduation certificate or official statement',
    'Military service certificate or exemption (for males)',
    '2 personal photos',
    'National ID card (front and back)'
  ];

  resources: Resource[] = [
    { name: 'maharatech.gov.eg', url: 'https://maharatech.gov.eg' },
    { name: 'Review IQ, IT Basics, and English topics via YouTube', url: 'https://www.youtube.com/channel/UCGHjqW4Wsg2CNo8-N5KSSUQ' }
  ];
}