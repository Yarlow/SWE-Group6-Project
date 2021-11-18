import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  isLoading:boolean = false
  hotels: Hotel[] = [];
  private hotelsSub: Subscription;

  mode: string = 'reservation';

  constructor(private hotelService: HotelService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // this.onGetHotels();
    if (this.router.url.includes('hotel/manager')) {
      this.mode = 'manager'
      console.log(this.mode)
    }

    if (this.mode === 'reservation') {
      if (this.route.snapshot.queryParams.length > 0) {
        console.log('true?')
        this.hotelService.filterHotels(this.route.snapshot.queryParams)
      } else {
        this.hotelService.getHotels();
      }
      this.isLoading = true;
      this.hotelsSub = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
        this.isLoading = false;
        this.hotels = hotels;
      })
    } else {
      this.isLoading = true;
      this.hotelService.getManagerHotels();
      this.hotelsSub = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
        this.isLoading = false;
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
