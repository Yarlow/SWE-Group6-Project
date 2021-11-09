import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log(route)
    console.log(state.url)
    const isAuth = this.userService.getIsAuth()
    if (!isAuth) {
      this.router.navigate(['/login']) // maybe change this...
    }
    // if (state.url == "/admin"){
    //   if (this.userService.getRole() !== "admin"){
    //     this.router.navigate(['/account']) // maybe change this...
    //   }
    // }
    return isAuth;

  }

}
