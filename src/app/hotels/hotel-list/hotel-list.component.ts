import { Component, OnInit } from '@angular/core';
import { HotelService } from 'src/app/service/hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {

  hotels = [];

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
  }

  onGetHotels() {
    this.hotels = this.hotelService.getHotels();
    
  }

}
