import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDto } from '../../core/models/auth.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Role } from '../../core/models/role.enum';
import { countries, Country } from '../../shared/data/countries';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    NavbarComponent, 
    FooterComponent,
    TranslateModule
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  showCountryDropdown = false;
  countries = countries;
  selectedCountry: Country = countries[0]; // Default to Tunisia

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

  private passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasMinLength = value.length >= 8;

    const errors: { [key: string]: boolean } = {};

    if (!hasUpperCase) errors['noUpperCase'] = true;
    if (!hasLowerCase) errors['noLowerCase'] = true;
    if (!hasNumber) errors['noNumber'] = true;
    if (!hasMinLength) errors['minLength'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        this.passwordValidator.bind(this)
      ]],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', [
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(15)
      ]]
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const countrySelector = document.querySelector('.country-selector');
    const dropdown = document.querySelector('.country-dropdown');
    
    if (countrySelector && dropdown) {
      const clickedInside = countrySelector.contains(event.target as Node);
      if (!clickedInside) {
        this.showCountryDropdown = false;
      }
    }
  }

  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
  }

  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
  }

  getFullPhoneNumber(): string {
    const phoneNumber = this.phoneNumber?.value || '';
    return this.selectedCountry.dialCode + phoneNumber;
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
      this.isLoading = true;
      this.errorMessage = null;

      const registerDto: RegisterDto = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        phoneNumber: this.getFullPhoneNumber() || undefined,
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