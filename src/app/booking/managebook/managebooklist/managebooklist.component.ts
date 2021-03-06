import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  isLoading: Boolean = false;

  constructor( public route: ActivatedRoute, private reservationService: ReservationService, private userService: UserService ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('hotelId')) {
        this.reservationService.getHotelReservations(paramMap.get('hotelId'));
        this.isLoading = true;
      } else {
        this.isLoading = true;

        this.user = this.userService.getUser()
        this.userSubscription = this.userService.getUserUpdateListener().subscribe((user:User) => {
          this.user = user
          console.log("Hiya")
          this.reservationService.getUserReservations(user._id)
        })
        this.reservationService.getUserReservations(localStorage.getItem('userID'))

      }
      console.log("atempting to get res")
      this.reservationsSubscription = this.reservationService.getPostUpdateListener().subscribe((reservations: Reservation[]) => {
        this.isLoading = false;
        this.reservations = reservations
        console.log(this.reservations)
      })


    })



    // let res: Reservation = this.user.reservations[0]
    // console.log(res)

    // console.log("HI" + this.user.reservations[0].hotel.name)
    // this.reservationService.getUserReservations(this.user._id)
  }

}
