import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/hotels/hotel-list/hotel-list-item/hotel-list-item.component';
import { Hotel } from 'src/app/hotels/hotel.model';
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

  constructor(
    public dialogref: MatDialogRef<BookingpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reservationService: ReservationService
  ) { }

  ngOnInit(): void {
    this.selectedHotel = this.data.hotel;
    this.weekendSurcharge = this.selectedHotel.price.weekendSurcharge;
    this.pricesToDisplay = delete this.selectedHotel.price['weekendSurcharge']
    console.log(this.pricesToDisplay)
    this.bookingForm = new FormGroup({
      'selectedPrice': new FormControl(),
      'startDate': new FormControl(),
      'endDate': new FormControl()

    })

  }

  onConfirmBook() {
    console.log(this.bookingForm.value.selectedPrice)
    let bedChoice = this.bookingForm.value.selectedPrice[0];
    let pricePerNight = this.bookingForm.value.selectedPrice[1];

    console.log("Start: "+ this.bookingForm.value.startDate)
    // console.log("Start + 1: "+ this.bookingForm.value.startDate.add(1, 'days'))
    let startDate = new Date(this.bookingForm.value.startDate)
    console.log("Start" + startDate)
    let endDate = new Date(this.bookingForm.value.endDate)
    let resPrice = 0
    console.log("End: "+ this.bookingForm.value.endDate)
    for (let day = startDate;day <= endDate; day.setDate(day.getDate() + 1)) {
      if (day.getDay() === 0 || day.getDay() === 6) {

        resPrice += pricePerNight * (1 + this.weekendSurcharge)
      } else {
        resPrice += pricePerNight
      }
    }
    console.log(resPrice)

    let reservation = {
      hotel: this.selectedHotel._id,
      user: '61572ceb634b48ec14db8953', //fix this
      startDate: startDate,
      endDate: endDate,
      price: resPrice
    }

    this.reservationService.bookReservation(reservation);
  }


}
