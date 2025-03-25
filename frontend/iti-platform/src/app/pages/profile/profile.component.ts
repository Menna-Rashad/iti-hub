import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      national_id: [''],
      role: [''],
      bio: [''],
      linkedin: [''],
      github: ['']
    });
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profileForm.patchValue(res);
        if (res.profile_picture) {
          this.previewUrl = `http://127.0.0.1:8000/profile_pictures/${res.profile_picture}`;
        }
      },
      error: () => {
        this.toastr.error('فشل تحميل البيانات', 'خطأ');
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastr.error('املأ كل الحقول المطلوبة');
      return;
    }

    const formData = new FormData();
Object.entries(this.profileForm.value).forEach(([key, value]) => {
  if (value) formData.append(key, value.toString());
});
if (this.selectedFile) {
  formData.append('profile_picture', this.selectedFile); // ✅ صورة فعلية
}


    this.profileService.updateProfile(formData).subscribe({
      next: () => this.toastr.success('تم التحديث بنجاح 🎉'),
      
      error: (err) => {
        console.error('🔴', err);
        if (err.error?.errors) {
          Object.entries(err.error.errors).forEach(([key, val]: any) =>
            this.toastr.error(val.join(', '), 'خطأ')
          );
        } else {
          this.toastr.error('حدث خطأ أثناء التحديث');
        }
      }
    });
  }
}
