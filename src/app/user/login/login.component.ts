import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loginAttemptMessage = ""
  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(),
      'password': new FormControl()
    })
  }


  onLogin() {
    let user = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.userService.login(user).then(responseMessage => {

      this.loginAttemptMessage = ""+responseMessage
      console.log(this.loginAttemptMessage)
    }).catch(error => {
      console.log(error)
      this.snackBar.open(error, "X")
    })
  }

  getErrorMessage() {
    if (this.loginAttemptMessage === "Not Found") {
      return "Username/Password Not Found"
    } else if (this.loginAttemptMessage === "Error") {
      return "Problem connecting, try again."
    } else {
      return "Something else?????"
    }
  }
}
