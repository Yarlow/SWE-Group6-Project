import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
  changePasswordForm: FormGroup

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      "currentPassword": new FormControl(),
      "newPassword": new FormControl(),
      "confirmNewPassword": new FormControl()
    })
  }

  onChangePassword(){
    if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.confirmNewPassword){
      let body = {
        oldPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword
      }
      this.userService.changePassword(body)
    }
  }

}
