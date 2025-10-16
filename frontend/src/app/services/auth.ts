import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    const body = { email, password };
    return this.http.post(`${environment.apiUrl}/api/signup`, body);
  }


   login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<{token:string}>(`${environment.apiUrl}/api/signin`, body);
  }

    logout(){
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    isloggedIn(){
      return !!localStorage.getItem('token');
    }

    getToken(){
      return localStorage.getItem('token')
    }
}
