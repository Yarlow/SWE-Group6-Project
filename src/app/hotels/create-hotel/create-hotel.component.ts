import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotelService } from 'src/app/service/hotel.service';

@Component({
  selector: 'app-create-hotel',
  templateUrl: './create-hotel.component.html',
  styleUrls: ['./create-hotel.component.css']
})
export class CreateHotelComponent implements OnInit {
  createHotelForm: FormGroup
  amenities: string[] = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi']

  constructor( private hotelService: HotelService ) { }

  ngOnInit(): void {
    this.createHotelForm = new FormGroup({
      "hotelName": new FormControl(),
      "numRooms" :new FormControl(),
      'standardPrice': new FormControl(),
      'queenPrice': new FormControl(),
      'kingPrice': new FormControl(),
      'weekendSurcharge': new FormControl(),
      'selectedAmenities': new FormControl()
    })
  }

  onCreateHotel() {

  }

}
