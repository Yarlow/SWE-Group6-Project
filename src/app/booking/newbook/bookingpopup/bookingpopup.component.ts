import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/service/reservation.service';
import { Hotel } from 'src/app/hotels/hotel.model';
import { UserService } from 'src/app/service/user.service';
import { ReservationService } from '../../../service/reservation.service'

@Component({
  selector: 'app-bookingpopup',
  templateUrl: './bookingpopup.component.html',
  styleUrls: ['./bookingpopup.component.css']
})
export class BookingpopupComponent implements OnInit {

  selectedHotel: Hotel
  bookingForm: FormGroup;
  pricesToDisplay: any;
  weekendSurcharge: number;
  resPrice: number;
  actionText: string;
  mode: string

  constructor(
    public dialogref: MatDialogRef<BookingpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reservationService: ReservationService,
    private userService: UserService
  ) { }
  defaultPrice: number = 0
  defaultBed: string = ""
  defaultStartDate: Date = null
  defaultEndDate: Date = null
  ngOnInit(): void {
    console.log("Booking init");
    this.selectedHotel = this.data.hotel;
    this.weekendSurcharge = this.selectedHotel.price.weekendSurcharge;
    this.pricesToDisplay = delete this.selectedHotel.price['weekendSurcharge']
    console.log(this.pricesToDisplay)
    this.actionText = this.data.reservation ? "Update Reservation" : "Book Reservation"
    this.mode = this.data.reservation ? "Edit" : "Create"
    if (this.data.reservation){

      this.defaultStartDate = this.data.reservation.startDate ? this.data.reservation.startDate : null
      this.defaultEndDate = this.data.reservation.endDate ? this.data.reservation.endDate : null
      this.defaultBed = this.data.reservation.bedChoice
      this.defaultPrice = this.data.hotel.price[this.defaultBed]
      console.log(this.defaultPrice)
      console.log(this.defaultBed)
    }
    // if (this.data.startDate){
    //
    // }
    this.bookingForm = new FormGroup({
      'selectedPrice': new FormControl(null, {validators: [Validators.required]}),
      'startDate': new FormControl(this.defaultStartDate, {validators: [Validators.required]}),
      'endDate': new FormControl(this.defaultEndDate, {validators: [Validators.required]})
    })
    this.onChanges()
  }

  onChanges() {

    this.bookingForm.valueChanges.subscribe(x => {
      if (this.bookingForm.invalid){
        return
      }
      this.resPrice = this.calculatePrice(new Date(this.bookingForm.value.startDate), new Date(this.bookingForm.value.endDate))
      console.log(this.resPrice)
    })
  }

  calculatePrice(startDate: Date, endDate: Date){
    let resPrice = 0
    let pricePerNight = this.bookingForm.value.selectedPrice[1];

    for (let day = startDate;day <= endDate; day.setDate(day.getDate() + 1)) {
      if (day.getDay() === 0 || day.getDay() === 6) {

        resPrice += pricePerNight * (1 + this.weekendSurcharge)
      } else {
        resPrice += pricePerNight
      }
    }
    this.resPrice = resPrice
    return resPrice
  }

  onConfirmBook() {
    if (this.bookingForm.invalid){
      return
    }
    let bedChoice = this.bookingForm.value.selectedPrice[0];
    let pricePerNight = this.bookingForm.value.selectedPrice[1];
    let startDate = new Date(this.bookingForm.value.startDate)
    let endDate = new Date(this.bookingForm.value.endDate)
    let resPrice = this.calculatePrice(startDate, endDate)
    let reservation = {
      hotel: this.selectedHotel._id,
      user: localStorage.getItem('userID'), //fix this
      startDate: new Date(this.bookingForm.value.startDate),
      endDate: new Date(this.bookingForm.value.endDate),
      price: resPrice,
      bedChoice: bedChoice
    }
    if (this.mode === "Create"){

      console.log(reservation)
      this.reservationService.bookReservation(reservation);
    } else {
      this.reservationService.updatedReservation(this.data.reservation._id ,reservation)
    }
  }


}
