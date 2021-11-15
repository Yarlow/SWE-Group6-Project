import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from 'src/app/service/hotel.service';
import { Hotel } from '../hotel.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-create-hotel',
  templateUrl: './create-hotel.component.html',
  styleUrls: ['./create-hotel.component.css']
})
export class CreateHotelComponent implements OnInit {
  createHotelForm: FormGroup
  amenities: string[] = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi']
  mode: string = 'create'
  hotelId: string


  constructor( private hotelService: HotelService, public route: ActivatedRoute, private userService: UserService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.createHotelForm = new FormGroup({
        "hotelName": new FormControl(null, {validators: [Validators.required]}),
        "numRooms" :new FormControl(null, {validators: [Validators.required]}),
        'standardPrice': new FormControl(),
        'queenPrice': new FormControl(),
        'kingPrice': new FormControl(),
        'weekendSurcharge': new FormControl(null, {validators: [Validators.required]}),
        'selectedAmenities': new FormControl(null, {validators: [Validators.required]}),
        'managers': new FormControl()
      })

      if (paramMap.has('hotelId')) {
        this.mode = 'edit';
        this.hotelId = paramMap.get('hotelId')
        this.hotelService.getHotelById(this.hotelId).subscribe(hotelData => {
          console.log(hotelData)
          let hotel = hotelData.hotel
          this.createHotelForm.patchValue({
            'hotelName': hotel.name,
            'numRooms': hotel.rooms,
            'standardPrice': hotel.price.standard,
            'queenPrice': hotel.price.queen,
            'kingPrice': hotel.price.king,
            'weekendSurcharge': hotel.price.weekendSurcharge * 100,
            'selectedAmenities': hotel.amenities,
            'managers': hotelData.managers
          })
          this.createHotelForm.get('numRooms').disable()
          if (!hotel.price.standard) {
            this.createHotelForm.get('standardPrice').disable()
          }
          if (!hotel.price.queen) {
            this.createHotelForm.get('queenPrice').disable()
          }
          if (!hotel.price.king) {
            this.createHotelForm.get('kingPrice').disable()
          }
        })
      }

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

    let managerUsernames = this.createHotelForm.value.managers ? this.createHotelForm.value.managers.split(',') : null

    for (let manager in managerUsernames) {
      managerUsernames[manager] = managerUsernames[manager].trim()
    }
    console.log(managerUsernames)
    if (this.mode === 'edit') {
      this.hotelService.editHotel(hotel, managerUsernames)
    } else {
      this.hotelService.createHotel(hotel, managerUsernames);
    }
  }
}
