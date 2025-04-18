import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDto } from '../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Role } from '../../core/models/role.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: [''], // Optional, no validators
    }, { validators: this.passwordMatchValidator });
  }

  // Form getters
  get name(): AbstractControl | null { return this.registerForm?.get('name'); }
  get email(): AbstractControl | null { return this.registerForm?.get('email'); }
  get password(): AbstractControl | null { return this.registerForm?.get('password'); }
  get confirmPassword(): AbstractControl | null { return this.registerForm?.get('confirmPassword'); }
  get phoneNumber(): AbstractControl | null { return this.registerForm?.get('phoneNumber'); }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const registerDto: RegisterDto = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phoneNumber: this.registerForm.value.phoneNumber || undefined,
        role: Role.CLIENT
      };

      this.authService.register(registerDto).subscribe({
        next: (response) => {
          // Auto-login after successful registration
          this.authService.login({ email: registerDto.email, password: registerDto.password }).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/']);
            },
            error: (loginError) => {
              this.isLoading = false;
              this.errorMessage = 'Registration succeeded, but login failed. Please try logging in manually.';
              console.error('Login error after registration:', loginError);
              this.router.navigate(['/auth/login']);
            }
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          // Use the error message from the service
          this.errorMessage = error.message;
          
          // If it's an email conflict, focus on the email field
          if (error.status === 409) {
            const emailControl = this.registerForm.get('email');
            emailControl?.markAsTouched();
            // Clear the email field to encourage using a different email
            emailControl?.setValue('');
          }
          
          // Mark all form controls as touched to show validation errors
          Object.keys(this.registerForm.controls).forEach(key => {
            const control = this.registerForm.get(key);
            control?.markAsTouched();
          });
        }
      });
    } else {
      if (this.registerForm?.errors?.['passwordMismatch']) {
        this.errorMessage = 'Passwords do not match';
      }
      Object.keys(this.registerForm?.controls || {}).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}