import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AccountInfoComponent } from './user/account-info/account-info.component';

import { NewbookComponent } from './booking/newbook/newbook.component';
import { ManagebookComponent } from './booking/managebook/managebook.component';
import { HotelListComponent } from './hotels/hotel-list/hotel-list.component';
import { HotelListItemComponent } from './hotels/hotel-list/hotel-list-item/hotel-list-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotelsComponent } from './hotels/hotels.component';
import { FilterComponent } from './booking/newbook/filter/filter.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar'
// import { MatCardModule } from '@angular/material/card'
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { BookingpopupComponent } from './booking/newbook/bookingpopup/bookingpopup.component';
import { ManagebooklistComponent } from './booking/managebook/managebooklist/managebooklist.component';
import { ManagebooklistItemComponent } from './booking/managebook/managebooklist/managebooklist-item/managebooklist-item.component';
import { AdminComponent } from './user/admin/admin.component';
import { CreateHotelComponent } from './hotels/create-hotel/create-hotel.component'

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    NewbookComponent,
    ManagebookComponent,
    HotelListComponent,
    HotelListItemComponent,
    HotelsComponent,
    FilterComponent,
    LoginComponent,
    RegisterComponent,
    AccountInfoComponent,
    BookingpopupComponent,
    ManagebooklistComponent,
    ManagebooklistItemComponent,
    AdminComponent,
    CreateHotelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgxSliderModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
