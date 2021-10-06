import { Injectable } from '@angular/core';
import { User } from '../user/user.model';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean; // This is for compoments that may load /after/ the user is signed in.. the AuthListener only updates a components variable when it changes.
  user: User;

  constructor(private http: HttpClient, private router: Router) { }

  getUser(): User {
    return null;
  }

  signUp(user: {username: string, password: string}) {
    this.http.post<{ message: string }>("http://localhost:3000/api/users", user)
      .subscribe(responseData => {
        console.log(responseData.message);
      })
  }

  login(user: { username: string, password: string }){
    let responseMessageToReturn: string = ""
    return new Promise(resolve => {
      this.http.post<{ message: string, token: string }>("http://localhost:3000/api/users/login", user)
        .subscribe(responseData => {
          const token = responseData.token;
          responseMessageToReturn = responseData.message;
          this.token = token;
          console.log(responseData);
          if (token) {
            this.authStatusListener.next(true);
            this.isAuthenticated = true;
            this.router.navigate(['/']);
          }
          resolve(responseData.message);
        })
    })

      // return responseMessageToReturn
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  getToken(){
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

}
