import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  user: User
  userSubscription: Subscription

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser()
    // this.userService.getSignedInUserInfo()

    this.userSubscription = this.userService.getUserUpdateListener().subscribe((newUser: User) => {
      this.user = newUser
      // console.log(this.user.reservations)
    })
  }

}
