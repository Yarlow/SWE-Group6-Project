import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../booking/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  bookReservation(reservation) {
    this.http.post<{ message: string }>('http://localhost:3000/api/reservations', reservation).subscribe(res => {
      console.log(res.message)
    })
  }

  getUserReservations(userID: string){
    this.http.get<{message: string, reservations: Reservation[]}>('http://localhost:3000/api/reservations/user/:id').subscribe(responseData => {

    })
  }

  getHotelReservations(hotelID: string){

  }

  deleteHotel() {
    this.http.delete<{message:string}>('http://localhost:3000/api/reservations').subscribe(responseData => {
      
    })
  }

}
