import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { UserService } from '../../service/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm: FormGroup
  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'username': new FormControl(),
      'password': new FormControl()
    })
  }

  onSingup() {
    let user = {
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    }

    this.userService.signUp(user);
  }

}
