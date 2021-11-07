import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { BookingpopupComponent } from '../booking/newbook/bookingpopup/bookingpopup.component';
import { Reservation } from '../booking/reservation.model';
import { Hotel } from '../hotels/hotel.model';

export interface DialogData {
  hotel: Hotel,
  reservation: Reservation
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations: Reservation[]
  private reservationsUpdated = new Subject<Reservation[]>()

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  bookReservation(reservation) {
    this.http.post<{ message: string }>('http://localhost:3000/api/reservations', reservation).subscribe(res => {
      console.log(res.message)
    })
  }

  openBookingPopup(data: any) {
    const dialogRef = this.dialog.open(BookingpopupComponent, {
      data: data
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Dialog was closed');
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
    this.http.delete<{action:string}>('http://localhost:3000/api/reservations/'+id).subscribe(responseData => {
      if (responseData.action === "deleted"){
        const updatedReservations = this.reservations.filter(reservation => reservation._id !== id)
        this.reservations = updatedReservations
        this.reservationsUpdated.next([...this.reservations])
      }
    })
  }

}
