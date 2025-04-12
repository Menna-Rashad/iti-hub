import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobHeaderComponent } from './job-header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

describe('JobHeaderComponent', () => {
  let component: JobHeaderComponent;
  let fixture: ComponentFixture<JobHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        JobHeaderComponent,
        MatIconModule,
        MatButtonModule,
        MatMenuModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobHeaderComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    component.title = 'Software Engineer';
    component.company = 'Tech Corp';
    component.createdAt = '2024-04-12T00:00:00.000Z';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display job title and company name', () => {
    const titleElement = fixture.nativeElement.querySelector('h1');
    const companyElement = fixture.nativeElement.querySelector('.company-name');
    
    expect(titleElement.textContent).toContain('Software Engineer');
    expect(companyElement.textContent).toContain('Tech Corp');
  });

  it('should display formatted date', () => {
    const dateElement = fixture.nativeElement.querySelector('.post-time');
    expect(dateElement.textContent).toContain('Apr 12, 2024');
  });

  it('should have action menu button', () => {
    const menuButton = fixture.nativeElement.querySelector('button[mat-icon-button]');
    expect(menuButton).toBeTruthy();
    expect(menuButton.querySelector('mat-icon').textContent).toContain('more_vert');
  });

  it('should have menu items', () => {
    const menuItems = fixture.nativeElement.querySelectorAll('button[mat-menu-item]');
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].textContent).toContain('Edit');
    expect(menuItems[1].textContent).toContain('Delete');
    expect(menuItems[2].textContent).toContain('Report');
  });
}); 