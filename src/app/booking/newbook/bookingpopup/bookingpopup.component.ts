import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/service/reservation.service';
import { Hotel } from 'src/app/hotels/hotel.model';
import { UserService } from 'src/app/service/user.service';
import { ReservationService } from '../../../service/reservation.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookingpopup',
  templateUrl: './bookingpopup.component.html',
  styleUrls: ['./bookingpopup.component.css']
})
export class BookingpopupComponent implements OnInit {

  selectedHotel: Hotel
  bookingForm: FormGroup;
  pricesToDisplay = {}
  weekendSurcharge: number;
  resPrice: number;
  actionText: string;
  mode: string
  prompt: string

  constructor(
    public dialogref: MatDialogRef<BookingpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reservationService: ReservationService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }
  defaultPrice: number = 0
  defaultBed: string = ""
  defaultStartDate: Date = null
  defaultEndDate: Date = null
  defaultPriceToDisplay: [string, number];
  ngOnInit(): void {
    console.log("Booking init");
    this.selectedHotel = this.data.hotel;
    this.weekendSurcharge = this.selectedHotel.price.weekendSurcharge;

    if (this.selectedHotel.price.standard){
      this.pricesToDisplay['standard'] = this.selectedHotel.price.standard
    }
    if (this.selectedHotel.price.queen){
      this.pricesToDisplay['queen'] = this.selectedHotel.price.queen
    }
    if (this.selectedHotel.price.king){
      this.pricesToDisplay['king'] = this.selectedHotel.price.king
    }
    console.log(this.pricesToDisplay)

    this.actionText = this.data.reservation ? "Update Reservation" : "Book Reservation"
    this.mode = this.data.reservation ? "Edit" : "Create"
    this.prompt = this.mode === 'Edit' ? "Modify Reservation at" : "Book a Room With"
    if (this.data.reservation){

      this.defaultStartDate = this.data.reservation.startDate ? this.data.reservation.startDate : null
      this.defaultEndDate = this.data.reservation.endDate ? this.data.reservation.endDate : null
      this.defaultBed = this.data.reservation.bedChoice
      this.defaultPrice = this.data.hotel.price[this.defaultBed]
      console.log(this.defaultPrice)
      console.log(this.defaultBed)
      this.defaultPriceToDisplay = [this.defaultBed, this.defaultPrice]
    }
    // if (this.data.startDate){
    //
    // }
    this.bookingForm = new FormGroup({
      'selectedPrice': new FormControl([this.defaultBed, this.pricesToDisplay[this.defaultBed] ], {validators: [Validators.required]}),
      'startDate': new FormControl(this.defaultStartDate, {validators: [Validators.required]}),
      'endDate': new FormControl(this.defaultEndDate, {validators: [Validators.required]})
    })
    if (this.data.reservation) {
      this.bookingForm.patchValue({
        'selectedPrice' : [this.defaultBed, this.defaultPrice]
      })
      this.resPrice = this.calculatePrice(new Date(this.bookingForm.value.startDate), new Date(this.bookingForm.value.endDate))

    }
    this.onChanges()
  }

  compare(c1: [key: string, val: number], c2: [key: string, val: number]) {
    return c1 && c2 && c1[0] === c2[0]
  }

  onChanges() {
    console.log(this.bookingForm.value.selectedPrice)

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
    console.log(this.bookingForm.value.selectedPrice)
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
      this.reservationService.bookReservation(reservation).subscribe(responseData => {
        if (responseData.message === 'no rooms') {
          console.log("unavailable")
          this.snackBar.open("No Rooms available for that day or bed type", 'X')
        } else {
          this.snackBar.open("Reservation Booked Successfully", 'X')
          this.dialogref.close()
        }
      });
    } else {
      this.reservationService.updatedReservation(this.data.reservation._id ,reservation)
      this.snackBar.open("Reservation Changed Successfully", 'X')
      this.dialogref.close();
    }

  }


}
