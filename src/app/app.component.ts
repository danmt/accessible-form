import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  submitted = false;
  form = this.fb.group({
    firstName: ['', { validators: [Validators.required] }],
    lastName: ['', { validators: [Validators.required] }],
    email: ['', { validators: [Validators.required, Validators.email] }]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    this.submitted = true;
  }
}
