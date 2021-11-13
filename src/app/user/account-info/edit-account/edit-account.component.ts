import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  changePasswordForm: FormGroup

  constructor() { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      "currentPassword": new FormControl(),
      "newPassword": new FormControl(),
      "confirmNewPassword": new FormControl()
    })
  }

  onChangePassword(){
    
  }

}
