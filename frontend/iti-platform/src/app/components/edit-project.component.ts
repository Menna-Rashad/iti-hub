import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OpenProjectService, OpenProject } from '../services/open-project.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: number;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private projectService: OpenProjectService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      technologies: [''],
      github_url: [''],
      status: ['under_development', Validators.required],
      category: ['', Validators.required]
    });

    this.loadProject();
  }

  loadProject(): void {
    this.projectService.getAllProjects().subscribe(projects => {
      const project = projects.find(p => p.id === this.projectId);
      if (project) {
        this.projectForm.patchValue(project);
        this.loading = false;
      } else {
        this.toastr.error('Project not found');
        this.router.navigate(['/open-projects']);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/open-projects']);
  }
  
  onSubmit(): void {
    if (this.projectForm.invalid) return;

    this.projectService.updateProject(this.projectId, this.projectForm.value).subscribe({
      next: () => {
        this.toastr.success('Project updated successfully');
        this.router.navigate(['/open-projects']);
      },
      error: () => {
        this.toastr.error('Failed to update project');
      }
    });
  }
}
