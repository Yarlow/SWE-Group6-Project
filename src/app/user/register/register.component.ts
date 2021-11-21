import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup
  showHotelPassword: boolean = false;
  isLoading: boolean = false;

  constructor( private userService: UserService, private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, {validators: [Validators.required]}),
      'password': new FormControl(null, {validators: [Validators.required]}),
    })
  }

  onSingup() {
    if (this.signupForm.invalid){
      return
    }
    let user = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
    }
    this.isLoading = true;
    this.userService.signUp(user).subscribe(responseData => {
      console.log(responseData.message);
      this.isLoading = true;
      this.snackBar.open('Account Created Successfully', 'X')
      this.userService.login(user)
    });
  }

}
