import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HotelService } from 'src/app/service/hotel.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/user/user.model';
import { Hotel } from '../hotel.model';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit, OnDestroy {

  hotels: Hotel[] = [];
  private hotelsSub: Subscription;

  mode: string = 'reservation';

  constructor(private hotelService: HotelService, private router: Router) { }

  ngOnInit(): void {
    // this.onGetHotels();
    if (this.router.url.includes('hotel/manager')) {
      this.mode = 'manager'
      console.log(this.mode)
    }

    if (this.mode === 'reservation') {
      this.hotelService.getHotels();
      this.hotelsSub = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
        this.hotels = hotels;
      })
    } else {
      this.hotelService.getManagerHotels();
      this.hotelsSub = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
        this.hotels = hotels;
      })
    }

  }

  ngOnDestroy() : void {
    this.hotelsSub.unsubscribe()
  }

  onGetHotels() {


  }

}
