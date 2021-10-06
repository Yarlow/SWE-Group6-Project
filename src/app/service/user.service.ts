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
  private tokenTimer: NodeJS.Timer;
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
      this.http.post<{ message: string, token: string, expiresIn: number }>("http://localhost:3000/api/users/login", user)
        .subscribe(responseData => {
          const token = responseData.token;
          this.token = token;
          responseMessageToReturn = responseData.message;
          console.log(responseData);
          if (token) {
            const expiresInDuration = responseData.expiresIn
            this.setAuthTimer(responseData.expiresIn)
            this.authStatusListener.next(true);
            const now = new Date()
            const expirationDate = new Date( now.getTime() + expiresInDuration * 1000)
            console.log(expirationDate)
            this.saveAuthData(token, expirationDate)
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
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
  }

  setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration)
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000) // duration needs to be in milliseconds
  }

  autoAuthUser() { // checks local storage
    const authInfo = this.getAuthData()

    if (authInfo){
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        console.log("expires in " + expiresIn)
        if (expiresIn > 0){
          this.token = authInfo.token;
          this.isAuthenticated = true
          this.setAuthTimer(expiresIn / 1000) //subtracting the two times returns a milisecond
          this.authStatusListener.next(true)
        }
    } else {
      return
    }
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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
  }

  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    if (!token || ! expirationDate){
      return
    }
    return {
      token: token,
      expirationDate: new Date (expirationDate)
    }
  }
}
