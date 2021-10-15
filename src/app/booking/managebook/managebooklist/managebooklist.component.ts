import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  userSubscription: Subscription
  reservations: Reservation[]
  reservationsSubscription: Subscription

  constructor( private reservationService: ReservationService, private userService: UserService ) { }

  ngOnInit(): void {


    this.user = this.userService.getUser()
    this.userSubscription = this.userService.getUserUpdateListener().subscribe((user:User) => {
      this.user = user
      console.log("Hiya")
      this.reservationService.getUserReservations(user._id)
    })
    this.reservationService.getUserReservations(localStorage.getItem('userID'))

    this.reservationsSubscription = this.reservationService.getPostUpdateListener().subscribe((reservations: Reservation[]) => {
      this.reservations = reservations
      console.log(this.reservations)
    })


    // let res: Reservation = this.user.reservations[0]
    // console.log(res)

    // console.log("HI" + this.user.reservations[0].hotel.name)
    // this.reservationService.getUserReservations(this.user._id)
  }

}
