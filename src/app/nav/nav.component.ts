import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import {trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  userRole: string = "";
  private authListenerSubscription: Subscription
  constructor(private userService: UserService) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.userService.getIsAuth()
    this.authListenerSubscription = this.userService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.userService.logout()
  }
}
