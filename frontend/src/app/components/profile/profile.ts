import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
 userData:any = null;
 errorMessage = '';

 constructor(private authService: Auth, private http: HttpClient){}

 ngOnInit(): void{
  this.http.get(environment.apiUrl+'/api/profile').subscribe({
    next: (response: any)=>{},
      error: (err:any)=>{
        console.error('Failed to fetch pofile,err');
        this.errorMessage = 'Could not load profile data.';
      },
  });
 }
 onLogout(){
  this.authService.logout();
 }
}
