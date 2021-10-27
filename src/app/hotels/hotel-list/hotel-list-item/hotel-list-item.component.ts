import { Component, Input, OnInit } from '@angular/core';
import { Hotel } from '../../hotel.model';
import { ReservationService } from 'src/app/service/reservation.service';

@Component({
  selector: 'app-hotel-list-item',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {

  @Input() hotelElement: Hotel;

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    console.log("HOTEL " + this.hotelElement)
  }

  onStartBook() {
    let data = {
      hotel: this.hotelElement
    }
    this.reservationService.openBookingPopup(data)
    // const dialogRef = this.dialog.open(BookingpopupComponent, {
    //   data: {
    //     hotel: this.hotelElement
    //   }
    // })



  }

}
