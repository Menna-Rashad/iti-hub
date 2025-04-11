import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenProjectListComponent } from './open-project-list.component';

describe('OpenProjectListComponent', () => {
  let component: OpenProjectListComponent;
  let fixture: ComponentFixture<OpenProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenProjectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
