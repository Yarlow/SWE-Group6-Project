import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from 'src/app/service/hotel.service';
import { Hotel } from '../hotel.model';

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
      "hotelName": new FormControl(null, {validators: [Validators.required]}),
      "numRooms" :new FormControl(null, {validators: [Validators.required]}),
      'standardPrice': new FormControl(),
      'queenPrice': new FormControl(),
      'kingPrice': new FormControl(),
      'weekendSurcharge': new FormControl(null, {validators: [Validators.required]}),
      'selectedAmenities': new FormControl(null, {validators: [Validators.required]})
    })
  }

  onCreateHotel() {
    if (this.createHotelForm.invalid){
      return
    }
    let hotel= {
      name: this.createHotelForm.value.hotelName,
      rooms: this.createHotelForm.value.numRooms,
      price: {
        king: this.createHotelForm.value.kingPrice,
        queen: this.createHotelForm.value.queenPrice,
        standard: this.createHotelForm.value.standardPrice,
        weekendSurcharge: this.createHotelForm.value.weekendSurcharge / 100
      },
      amenities: this.createHotelForm.value.selectedAmenities
    }

    // hotel = {
    //   ...hotel,
    //   price: {
    //     ...hotel.price,
    //     king: this.createHotelForm.value.kingPrice.replace('$','')
    //   }
    // }

    this.hotelService.createHotel(hotel);

    console.log(hotel)
  }

}
