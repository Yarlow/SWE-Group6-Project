import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    console.log("RES " + this.reservationElement)
    this.formatStartDate = formatDate(this.reservationElement.startDate,'fullDate', 'en_US')
    this.formatEndDate = formatDate(this.reservationElement.endDate,'fullDate', 'en_US')

  }

  onUpdateReservation() {
    console.log(this.reservationElement.endDate)
    let endDate = new Date(this.reservationElement.endDate)

    console.log("old date " + endDate.getDate())
    let newDate = new Date(endDate.getDate() + 365)
    console.log("new date "+ newDate)
    console.log(newDate)
    let update = {
      endDate: newDate
    }
    this.reservationService.updatedReservation(this.reservationElement._id, update)

  }

  onDeleteReservation() {
    this.reservationService.deleteReservation(this.reservationElement._id)
  }

}
