import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  // standalone:true,
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData = {email: '', password:''}
  errorMessage:string = '';

  constructor(private authService:Auth, private router:Router){}

  onLogin(){
    this.errorMessage  = '';
    const {email, password} = this.loginData;
    this.authService.login(email, password).subscribe({
      next:(responnse)=>{
        const token = responnse.token;
        localStorage.setItem('token',token);

        this.router.navigate(['/profile'])
      },
      error:(err)=>{
        this.errorMessage =
            this.errorMessage = err.error?.message || 'Login failed. Please try again.'
      },
    });
}
}
