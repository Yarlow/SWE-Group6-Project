import { Component, OnInit, OnDestroy } from '@angular/core';
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


  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.hotelService.getHotels();
    // this.onGetHotels();

    this.hotelsSub = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
      this.hotels = hotels;
    })
  }

  ngOnDestroy() : void {
    this.hotelsSub.unsubscribe()
  }

  onGetHotels() {


  }

}
