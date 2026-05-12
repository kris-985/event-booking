import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  protected isLoading = false;
  protected errorMessage = '';

  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordMatchValidator }
  );

  protected submit(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();
    this.isLoading = true;

    this.authService.register({ name, email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        void this.router.navigate(['/events']);
      },
      error: () => {
        this.errorMessage = 'Unable to create account. Please try again.';
        this.isLoading = false;
      }
    });
  }

  protected hasError(controlName: keyof typeof this.registerForm.controls, error: string): boolean {
    const control = this.registerForm.controls[controlName];

    return control.hasError(error) && (control.dirty || control.touched);
  }

  protected hasPasswordMismatch(): boolean {
    const confirmPassword = this.registerForm.controls.confirmPassword;

    return (
      this.registerForm.hasError('passwordMismatch') &&
      (confirmPassword.dirty || confirmPassword.touched)
    );
  }
}
