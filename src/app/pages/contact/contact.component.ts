import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  loading = false;
  success = false;
  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    agree: [false, Validators.requiredTrue],
    // Honeypot: echte Nutzer lassen es leer
    hp: ['']
  });

  ngOnInit(): void {
    const product = this.route.snapshot.queryParamMap.get('product');
    if (product) {
      const pre = `Anfrage zu: ${product}\n\n`;
      this.form.patchValue({ message: pre + (this.form.value.message ?? '') });
    }
  }

  submit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.value.hp) {
      // Bot erkannt (Honeypot gefüllt) – wir tun so als wäre es ok
      this.success = true;
      this.form.reset();
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = '';

    this.http.post('/api/contact', {
      name: this.form.value.name,
      email: this.form.value.email,
      message: this.form.value.message,
      agree: this.form.value.agree
    }, { headers: { 'Content-Type': 'application/json' } })
    .subscribe({
      next: () => { this.success = true; this.form.reset(); },
      error: () => { this.error = 'Senden fehlgeschlagen. Bitte später erneut versuchen.'; }
    })
    .add(() => this.loading = false);
  }
}
