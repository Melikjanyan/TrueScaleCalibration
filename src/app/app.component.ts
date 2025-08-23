import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageToggleComponent } from './shared/language-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslateModule, LanguageToggleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private t: TranslateService) {
    const saved = localStorage.getItem('lang') || this.t.getDefaultLang() || 'de';
    this.t.use(saved);
    document.documentElement.lang = saved;
  }
}
