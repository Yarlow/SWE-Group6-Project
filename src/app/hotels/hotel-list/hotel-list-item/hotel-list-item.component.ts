import { Component, Input, OnInit } from '@angular/core';
import { Hotel } from '../../hotel.model';
import { ReservationService } from 'src/app/service/reservation.service';
import { UserService } from 'src/app/service/user.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-list-item',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {

  @Input() hotelElement: Hotel;
  @Input() userRole: string;

  mode: string = 'reservation';
  currentRoute: string;

  constructor(private reservationService: ReservationService, private router: Router) { }

  ngOnInit(): void {
    // console.log("HOTEL " + this.hotelElement)

    if (this.router.url.includes('hotel/edit')) {
      this.mode = 'edit'
      console.log(this.mode)
    }
  }

  onStartBook() {
    if (this.mode === 'reservation') {
      let data = {
        hotel: this.hotelElement
      }
      this.reservationService.openBookingPopup(data)
    } else if (this.mode === 'edit') {
      this.router.navigate(['hotel/edit', this.hotelElement._id])
    }

    // const dialogRef = this.dialog.open(BookingpopupComponent, {
    //   data: {
    //     hotel: this.hotelElement
    //   }
    // })



  }

}
