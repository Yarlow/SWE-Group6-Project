import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from 'src/app/service/hotel.service';
import { Hotel } from '../hotel.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/user/user.model';
import { ReservationService } from 'src/app/service/reservation.service';
import { Reservation } from 'src/app/booking/reservation.model';

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
  hotelObj : Hotel
  reservations: Reservation[]
  isLoading: Boolean = false;

  constructor( private hotelService: HotelService, public route: ActivatedRoute, private userService: UserService, private snackBar: MatSnackBar, private reservationService : ReservationService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.createHotelForm = new FormGroup({
        "hotelName": new FormControl(null, {validators: [Validators.required]}),
        "numRooms" :new FormControl(null, {validators: [Validators.required]}),
        'standardPrice': new FormControl(),
        'queenPrice': new FormControl(),
        'kingPrice': new FormControl(),
        'weekendSurcharge': new FormControl(null, {validators: [Validators.required]}),
        'selectedAmenities': new FormControl(null, {}),
        'managers': new FormControl()
      })

      if (paramMap.has('hotelId')) {
        this.mode = 'edit';
        this.hotelId = paramMap.get('hotelId')
        this.isLoading = true;
        this.hotelService.getHotelById(this.hotelId).subscribe(hotelData => {
          console.log(hotelData)
          let hotel = hotelData.hotel
          this.hotelObj = hotelData.hotel
          let managerString = ''
          let i = 0;
          for (let manager of hotelData.managers){
            managerString += i < hotelData.managers.length - 1 ? manager.username + ', ' : manager.username
            i++
          }
          console.log('managerString' , managerString)
          this.createHotelForm.patchValue({
            'hotelName': hotel.name,
            'numRooms': hotel.rooms,
            'standardPrice': hotel.price.standard,
            'queenPrice': hotel.price.queen,
            'kingPrice': hotel.price.king,
            'weekendSurcharge': hotel.price.weekendSurcharge * 100,
            'selectedAmenities': hotel.amenities,
            'managers': managerString
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
          this.isLoading = false;

        })


      }

    })
  }

  onCreateHotel() {
    if (this.createHotelForm.invalid){
      return
    }
    if (!this.createHotelForm.value.standardPrice && !this.createHotelForm.value.queenPrice && !this.createHotelForm.value.kingPrice) {
        this.snackBar.open("Must have at least one price", "X")
        return
    }
    this.isLoading = true;
    let hotel = {
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
      hotel.rooms = this.hotelObj.rooms
      console.log(hotel)

      this.hotelService.editHotel(hotel, managerUsernames, this.hotelId)
    } else {
      this.hotelService.createHotel(hotel, managerUsernames);
    }
  }
}
