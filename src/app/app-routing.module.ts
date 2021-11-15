import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagebookComponent } from './booking/managebook/managebook.component';
import { NewbookComponent } from './booking/newbook/newbook.component';
import { HomeComponent } from './home/home.component';
import { CreateHotelComponent } from './hotels/create-hotel/create-hotel.component';
import { HotelListComponent } from './hotels/hotel-list/hotel-list.component';
import { AuthGuard } from './service/auth.guard';
import { AccountInfoComponent } from './user/account-info/account-info.component';
import { EditAccountComponent } from './user/account-info/edit-account/edit-account.component';
import { AdminComponent } from './user/admin/admin.component';
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
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/edit',
    component: EditAccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hotel/create',
    component: CreateHotelComponent  
  },
  {
    path: 'hotel/edit',
    component: HotelListComponent,
  },
  {
    path: 'hotel/edit/:hotelId',
    component: CreateHotelComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
