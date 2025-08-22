import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly API_BASE = 'http://localhost:3100'; // volle URL, KEIN Proxy

  constructor(private http: HttpClient) {}

  send(data: { name?: string; email: string; message: string; agree?: boolean; hp?: string }): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${this.API_BASE}/api/contact`, {
      name: data.name || '',
      email: data.email,
      message: data.message,
      agree: true,
      hp: ''
    });
  }
}
