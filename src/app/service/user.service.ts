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
  userUpdated = new Subject<User>()
  private userId: string
  private tokenTimer: NodeJS.Timer;
  constructor(private http: HttpClient, private router: Router) { }

  getUser(): User {
    console.log("IN GET USER THING " + this.user)
    return this.user;
  }

  setUser(user: User){
    this.user = user
  }

  setUserId(id: string) {
    this.userId = id
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
      this.http.post<{ message: string, token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/users/login", user)
        .subscribe(responseData => {
          const token = responseData.token;
          responseMessageToReturn = responseData.message;
          console.log(responseData);
          if (token) {
            this.token = token;
            const expiresInDuration = responseData.expiresIn
            this.setAuthTimer(responseData.expiresIn)
            this.authStatusListener.next(true);
            const now = new Date()
            const expirationDate = new Date( now.getTime() + expiresInDuration * 1000)
            console.log(expirationDate)
            this.saveAuthData(token, expirationDate, responseData.userId)
            this.isAuthenticated = true;
            this.setUserId(responseData.userId)
            // this.getuserInfo()
            // this.setUser(this.getUserInfo(responseData.userId))
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
          this.userId = authInfo.userId
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


  getSignedInUser() {
    // console.log("USER ID ID IDIDIIDID" + userId)
    this.http.get<{user: User}>('http://localhost:3000/api/users/' + this.userId).subscribe(responseData => {
      console.log("RETURNING" + responseData.user)
      this.user = {
        _id: responseData.user._id,
        username: responseData.user.username,
        reservations: responseData.user.reservations,
        managerOf: responseData.user.managerOf
      }
      this.userUpdated.next(this.user)
      console.log("hi" + this.user)
      // return {
      //   username: responseData.user.username,
      //   reservations: responseData.user.reservations,
      //   managerOf: responseData.user.managerOf
      // }
    }, (err) => {
      console.log("ERROR")
      // return null
    })
    console.log("DEFAULT???????????")


  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable()
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userID', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userID')
  }

  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("expiration")
    const userId = localStorage.getItem("userID")
    if (!token || ! expirationDate){
      return
    }
    return {
      token: token,
      expirationDate: new Date (expirationDate),
      userId: userId
    }
  }
}
