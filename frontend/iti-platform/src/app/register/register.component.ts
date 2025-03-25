import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationData, RegistrationService } from '../registration.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  registrationForm: FormGroup; 

  constructor(private RegistrationService: RegistrationService) {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      linkedin: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i)
      ]),
      github: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/.*$/i)
      ]),
      profilePicture: new FormControl(null, [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  get FormControls(){
    return this.registrationForm.controls;
  }

  async handleSubmitForm(){
    
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    
    // Ensure your template file input has an id="profilePicture"
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    const file = fileInput?.files ? fileInput.files[0] : null;
    if (!file) {
      console.error('Profile picture is required.');
      return;
    }

    
    const formValues = this.registrationForm.value;
    const registrationData: RegistrationData = {
      ...formValues,
      profilePicture: file
    };

    try {
      const response = await this.RegistrationService.registerUser(registrationData);
      console.log('Registration successful:', response);
      
    } catch (error) {
      console.error('Registration failed:', error);
      
    }
  }
}
