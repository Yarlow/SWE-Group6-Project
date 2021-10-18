import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Reservation } from '../booking/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations: Reservation[]
  private reservationsUpdated = new Subject<Reservation[]>()

  constructor(private http: HttpClient) { }

  bookReservation(reservation) {
    this.http.post<{ message: string }>('http://localhost:3000/api/reservations', reservation).subscribe(res => {
      console.log(res.message)
    })
  }

  getUserReservations(userID: string){
    console.log(userID)
    this.http.get<{message: string, reservations: Reservation[]}>('http://localhost:3000/api/reservations/user/'+userID).subscribe(responseData => {
      this.reservations = responseData.reservations
      console.log(responseData.reservations)
      this.reservationsUpdated.next([...this.reservations])
    })
  }

  getHotelReservations(hotelID: string){

  }

  getPostUpdateListener() {
    return this.reservationsUpdated.asObservable()
  }

  updatedReservation(id: string, reservationUpdate: any) {
    this.http.patch<{message: string}>('http://localhost:3000/api/reservations/'+id, reservationUpdate).subscribe(resData => {
      
    })
  }

  deleteReservation(id: string) {
    this.http.delete<{message:string}>('http://localhost:3000/api/reservations/'+id).subscribe(responseData => {
      if (responseData.message === "success"){
        const updatedReservations = this.reservations.filter(reservation => reservation._id !== id)
        this.reservations = updatedReservations
        this.reservationsUpdated.next([...this.reservations])
      }
    })
  }

}
