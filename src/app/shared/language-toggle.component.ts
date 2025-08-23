import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .lang-toggle {
      display:inline-flex; align-items:center; gap:8px;
      padding:6px 10px; border:1px solid rgba(0,0,0,.12);
      border-radius:999px; background:#fff; font-weight:600;
    }
    .btn { border:0; background:transparent; cursor:pointer; opacity:.6; }
    .btn.active { opacity:1; color:#1d4ed8; }
  `],
  template: `
    <div class="lang-toggle" role="group" aria-label="Language">
      <button class="btn" [class.active]="lang==='de'" (click)="set('de')" aria-label="Deutsch">DE</button>
      <span>·</span>
      <button class="btn" [class.active]="lang==='en'" (click)="set('en')" aria-label="English">EN</button>
    </div>
  `
})
export class LanguageToggleComponent {
  private t = inject(TranslateService);
  lang = this.t.currentLang || this.t.getDefaultLang() || 'de';

  constructor() {
    const saved = localStorage.getItem('lang');
    if (saved) this.set(saved); else this.apply(this.lang);
  }

  set(l: string) {
    if (l === this.lang) return;
    this.lang = l;
    localStorage.setItem('lang', l);
    this.apply(l);
  }

  private apply(l: string) {
    this.t.use(l);
    document.documentElement.lang = l;
  }
}
