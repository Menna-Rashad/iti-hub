import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
        this.profileForm.patchValue({
          name: res.name,
          email: res.email,
          national_id: res.national_id,
          role: res.role,
          bio: res.bio,
          linkedin: res.linkedin,
          github: res.github
        });

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
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    console.log(this.profileForm.value); // Debug the form values

    // Ensure required fields are filled before submitting
    if (!this.profileForm.value.name || !this.profileForm.value.email) {
      this.toastr.error('من فضلك تأكد من تعبئة الحقول الأساسية');
      return;
    }

    if (this.profileForm.invalid) {
      this.toastr.error('من فضلك املأ جميع الحقول المطلوبة');
      return;
    }

    const formData = new FormData();
    // Append all form values to FormData
    for (const [key, value] of Object.entries(this.profileForm.value)) {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }

    // Append the profile picture if selected
    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: () => this.toastr.success('تم تحديث البيانات بنجاح 🎉'),
      error: (err) => {
        console.error('🔴 Validation Error:', err.error);
        if (err.error.errors) {
          for (const key in err.error.errors) {
            this.toastr.error(err.error.errors[key].join(', '), 'خطأ');
          }
        } else {
          this.toastr.error('حصل خطأ أثناء التحديث ❌');
        }
      }
    });
  }
}
