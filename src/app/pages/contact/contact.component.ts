import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],   // <-- WICHTIG
})
export class ContactComponent {
  sending = false;
  success: string | null = null;
  error: string | null = null;

  form = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    agree: [false, Validators.requiredTrue],
    hp: [''],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  submit() {
    this.error = this.success = null;
    if (this.form.invalid) {
      this.error = 'Bitte Formular prüfen.';
      return;
    }
    this.sending = true;
    this.http.post('/api/contact', this.form.value, {
      headers: { 'Content-Type': 'application/json' },
    }).subscribe({
      next: () => {
        this.success = 'Nachricht wurde gesendet.';
        this.form.reset({ agree: false, hp: '' });
        this.sending = false;
      },
      error: (err) => {
        this.error = 'Senden fehlgeschlagen.';
        console.error(err);
        this.sending = false;
      }
    });
  }
}
