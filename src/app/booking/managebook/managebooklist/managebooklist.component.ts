import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/service/reservation.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/user/user.model';
import { Reservation } from '../../reservation.model';

@Component({
  selector: 'app-managebooklist',
  templateUrl: './managebooklist.component.html',
  styleUrls: ['./managebooklist.component.css']
})
export class ManagebooklistComponent implements OnInit {

  user : User


  constructor( private reservationService: ReservationService, private userService: UserService ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser()
    console.log(this.user)
    let res: Reservation = this.user.reservations[0]
    console.log(res)
    // console.log("HI" + this.user.reservations[0].hotel.name)
    // this.reservationService.getUserReservations(this.user._id)
  }

}
