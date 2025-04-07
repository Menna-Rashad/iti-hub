import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // أضف هذا السطر
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationData, RegistrationService } from '../registration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule], // ← أضف CommonModule هنا
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registrationForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private registrationService: RegistrationService, private router: Router) {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      national_id: new FormControl('', [Validators.required, Validators.pattern(/^\d{14}$/)]),
      linkedin: new FormControl('', [Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/)]),
      github: new FormControl('', [Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/.*$/)]),
      profilePicture: new FormControl(null)
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get FormControls() {
    return this.registrationForm.controls;
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.registrationForm.patchValue({
        profilePicture: this.selectedFile
      });
      this.registrationForm.get('profilePicture')?.updateValueAndValidity();
    }
  }

  async handleSubmitForm() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const formValues = this.registrationForm.value;
    const registrationData: RegistrationData = {
      ...formValues,
      profilePicture: this.selectedFile
    };

    try {
      const response = await this.registrationService.registerUser(registrationData).toPromise();
      console.log('✅ Registration successful:', response);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('❌ Registration failed:', error);
    }
  }
}