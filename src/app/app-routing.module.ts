import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagebookComponent } from './booking/managebook/managebook.component';
import { NewbookComponent } from './booking/newbook/newbook.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './service/auth.guard';
import { AccountInfoComponent } from './user/account-info/account-info.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'reservations/new',
    component: NewbookComponent
  },
  {
    path: 'reservations/manage',
    component: ManagebookComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'account',
    component: AccountInfoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
