import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';

import { NewbookComponent } from './booking/newbook/newbook.component';
import { ManagebookComponent } from './booking/managebook/managebook.component';
import { HotelListComponent } from './hotels/hotel-list/hotel-list.component';
import { HotelListItemComponent } from './hotels/hotel-list/hotel-list-item/hotel-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    NewbookComponent,
    ManagebookComponent,
    HotelListComponent,
    HotelListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
