import { Component, OnInit } from '@angular/core';
import { OpenProjectService, OpenProject } from '../../services/open-project.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ViewChild } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// Angular Material modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-open-project-list',
  templateUrl: './open-project-list.component.html',
  styleUrls: ['./open-project-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,        
    MatSelectModule,
    RouterModule 
  ],
})
export class OpenProjectListComponent implements OnInit {
  projects: OpenProject[] = [];
  loading = true;
  searchTerm: string = '';
  sortOption: string = 'newest';
  displayedColumns: string[] = ['name', 'status', 'category', 'github_url', 'actions'];
  dataSource!: MatTableDataSource<OpenProject>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private projectService: OpenProjectService , private toastr: ToastrService,private router: Router ) {}

  ngOnInit(): void {
    this.fetchProjects();
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        console.log('Projects fetched:', data);
        this.projects = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      }
    });
  }

  deleteProject(id: number): void {
    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== id);
        this.toastr.success('Project deleted successfully ✅', 'Success');
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.toastr.error('Failed to delete project ❌', 'Error');
      }
    });
  }

  filteredProjects(): OpenProject[] {
    if (!this.searchTerm) return this.projects;
    const term = this.searchTerm.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(term) ||
      project.category.toLowerCase().includes(term)
    );
  }

  get sortedProjects(): OpenProject[] {
    const filtered = this.filteredProjects();
    switch (this.sortOption) {
      case 'newest':
        return filtered.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      case 'oldest':
        return filtered.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      case 'az':
        return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'za':
        return filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return filtered;
    }
  }

  canEdit(project: OpenProject): boolean {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return currentUser?.id === project.user_id || currentUser?.role === 'admin';
  }

  viewDetails(id: number): void {
    this.router.navigate(['/open-projects', id]);
  }
}
