import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string {
    return localStorage.getItem('token');
  }

  saveToken(token: string) {
    console.log('token saved');
    localStorage.setItem('token', token);
  }

  destroyToken() {
    window.localStorage.removeItem('token');
  }
}
