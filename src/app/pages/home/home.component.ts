import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'], // falls du .scss nutzt; sonst weglassen/umbenennen
  imports: [
    CommonModule,
    RouterModule,     // wegen routerLink
    TranslateModule   // wegen | translate
  ]
})
export class HomeComponent {}
