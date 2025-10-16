import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupData = { email: '', password: ''};
  successMessage = '';
  errorMessage = '';

  constructor(private authService:Auth){}

  onSignup(){
    this.successMessage = '';
    this.errorMessage = '';

    const {email, password} = this.signupData;
    this.authService.signUp(email, password).subscribe({
      next:()=>{
        this.successMessage  = 'Registration successful! please login.';

        this.signupData = {email:'', password:''}
      },
      error:(err)=>{
        this.errorMessage = err.error || 'Signup failed. please try again.';
      }
    });
  }

}
