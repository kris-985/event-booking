import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface ContactInfo {
  title: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  private readonly formBuilder = inject(FormBuilder);

  protected submitted = false;

  protected readonly contactInfo: ContactInfo[] = [
    {
      title: 'Email',
      value: 'hello@evently.app',
      description: 'Send product questions, partnership ideas, or support requests.'
    },
    {
      title: 'Location',
      value: 'Sofia, Bulgaria',
      description: 'Built for event teams, communities, and venues across Europe.'
    },
    {
      title: 'Support hours',
      value: 'Mon-Fri, 09:00-18:00',
      description: 'We usually respond within one business day.'
    }
  ];

  protected readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  protected submit(): void {
    this.submitted = false;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitted = true;
    this.contactForm.reset();
  }

  protected hasError(controlName: keyof typeof this.contactForm.controls, error: string): boolean {
    const control = this.contactForm.controls[controlName];

    return control.hasError(error) && (control.dirty || control.touched);
  }
}
