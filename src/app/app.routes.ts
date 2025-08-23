// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', title: 'Start' },
  { path: 'kontakt', component: ContactComponent, title: 'Kontakt' },
  { path: '**', redirectTo: '' },
];
