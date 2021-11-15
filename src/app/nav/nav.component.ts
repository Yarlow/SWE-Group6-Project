import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { User } from '../user/user.model';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  userRole: string = "user";
  private authListenerSubscription: Subscription
  userSubscription: Subscription
  user: User


  constructor(private userService: UserService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.userService.getIsAuth()
    this.authListenerSubscription = this.userService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userRole = this.userService.getRole();
      console.log(this.userRole)
    });
    // this.userSubscription = this.userService.getUserUpdateListener().subscribe((newUser: User) => {
    //   this.user = newUser
    //   console.log(this.user.role)
    // })
  }

  onLogout() {
    this.userService.logout()
  }
}
