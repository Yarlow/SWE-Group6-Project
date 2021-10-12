import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup
  showHotelPassword: boolean = false;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl(null, {validators: [Validators.required]}),
      'password': new FormControl(null, {validators: [Validators.required]}),
      'hotelKey': new FormControl()
    })
  }

  onSingup() {
    if (this.signupForm.invalid){
      return
    }
    let user = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      hotelKey : this.signupForm.value.hotelKey
    }

    this.userService.signUp(user);
  }

}
