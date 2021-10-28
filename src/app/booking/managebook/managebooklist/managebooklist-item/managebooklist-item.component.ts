import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingpopupComponent } from 'src/app/booking/newbook/bookingpopup/bookingpopup.component';
import { Reservation } from 'src/app/booking/reservation.model';
import { ReservationService } from 'src/app/service/reservation.service';

@Component({
  selector: 'app-managebooklist-item',
  templateUrl: './managebooklist-item.component.html',
  styleUrls: ['./managebooklist-item.component.css']
})
export class ManagebooklistItemComponent implements OnInit {

  @Input() reservationElement: Reservation

  formatStartDate: string
  formatEndDate:string

  constructor(private reservationService: ReservationService, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log("RES " + this.reservationElement)
    this.formatStartDate = formatDate(this.reservationElement.startDate,'fullDate', 'en_US')
    this.formatEndDate = formatDate(this.reservationElement.endDate,'fullDate', 'en_US')

  }

  onUpdateReservation() {
    let data = {
      hotel: this.reservationElement.hotel,
      reservation: this.reservationElement
    }
    this.reservationService.openBookingPopup(data);
    
  }

  onDeleteReservation() {
    this.reservationService.deleteReservation(this.reservationElement._id)
  }

}
