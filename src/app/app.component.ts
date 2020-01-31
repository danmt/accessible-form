import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('errorsSection', { static: true }) errorsSection: ElementRef;
  submitted = false;
  form = this.fb.group({
    firstName: ['', { validators: [Validators.required] }],
    lastName: ['', { validators: [Validators.required] }],
    email: ['', { validators: [Validators.required, Validators.email] }]
  });
  errors = null;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.errors = {
        firstName: this.form.get('firstName').errors,
        lastName: this.form.get('lastName').errors,
        email: this.form.get('email').errors
      };
      this.errorsSection.nativeElement.focus();
    } else {
      this.errors = null;
    }
  }
}
