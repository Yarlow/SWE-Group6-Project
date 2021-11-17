import { Injectable } from '@angular/core';
import { User } from '../user/user.model';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) { }

  getUser(): User {
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
        this.snackBar.open('Account Created Successfully', 'X')
      })
  }

  login(user: { username: string, password: string }){
    let responseMessageToReturn: string = ""
    return new Promise((resolve, reject) => {
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
            this.saveAuthData(token, expirationDate, responseData.userId)
            this.isAuthenticated = true;
            this.setUserId(responseData.userId)
            this.getSignedInUserInfo()
            // this.getuserInfo()
            // this.setUser(this.getUserInfo(responseData.userId))
            this.router.navigate(['/account']);
          }
          resolve(responseData.message);
        }, (errorResponse) => {
          reject(errorResponse.error.message)
        })
    })

      // return responseMessageToReturn
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    this.userUpdated.next(this.user)

    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000) // duration needs to be in milliseconds
  }

  autoAuthUser() { // checks local storage
    const authInfo = this.getAuthData()

    if (authInfo){
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0){
          this.userId = authInfo.userId
          this.token = authInfo.token;
          this.isAuthenticated = true
          this.setAuthTimer(expiresIn / 1000) //subtracting the two times returns a milisecond
          this.authStatusListener.next(true)
          this.getSignedInUserInfo()
        }
    } else {
      return
    }
  }

  getToken(){
    return this.token;
  }


  getSignedInUserInfo() {
    this.http.get<{user: User}>('http://localhost:3000/api/users/' + this.userId).subscribe(responseData => {
      this.user = {
        _id: responseData.user._id,
        username: responseData.user.username,
        reservations: responseData.user.reservations,
        managerOf: responseData.user.managerOf,
        role: responseData.user.role
      }
      this.userUpdated.next(this.user)
    }, (err) => {
      console.log("ERROR")
      // return null
    })
  }

  getManagersByHotelId(){}

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

  getRole(){
    // console.log(this.user.role)
    return this.user.role;
  }

  testToken(){
    const token = localStorage.getItem("token")
    let body = {token: token}
    this.http.post('http://localhost:3000/api/users/token', body).subscribe(responseData => {

    })
  }

  changePassword(body) {
    body = {
      ...body,
      userId: this.user._id
    }
    this.http.patch<{message: string}>('http://localhost:3000/api/users/edit/changePassword', body).subscribe(responseData => {
      if (responseData.message === "success") {
        this.router.navigate(['/account'])
        this.snackBar.open("password changed successfully")
      } else {
        this.snackBar.open("The Passwords Don't Match")
      }
    })
  }

}
