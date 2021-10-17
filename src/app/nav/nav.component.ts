import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import {trigger, state, style, animate, transition} from '@angular/animations';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  animations: [
          // Each unique animation requires its own trigger. The first argument of the trigger function is the name
          trigger('rotatedState', [
            state('default', style({ transform: 'rotate(0)' })),
            state('rotated', style({ transform: 'rotate(-360deg)' })),
            transition('rotated => default', animate('2000ms ease-out')),
            transition('default => rotated', animate('2000ms ease-in'))
        ])
    ]
})
export class NavComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
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

  state: string = 'default';

  flip() {
      this.state = (this.state === 'default' ? 'rotated' : 'default');
  }
}
