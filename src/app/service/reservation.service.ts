import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    return this.http.post<{ message: string }>(environment.apiUrl + '/api/reservations', reservation)
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
    this.http.get<{message: string, reservations: Reservation[]}>(environment.apiUrl + '/api/reservations/user/'+userID).subscribe(responseData => {
      this.reservations = responseData.reservations
      console.log(responseData.reservations)
      this.reservationsUpdated.next([...this.reservations])
    })
  }

  getHotelReservations(hotelID: string){
    this.http.get<{ reservations: Reservation[] }>(environment.apiUrl + '/api/reservations/byHotel/'+hotelID).subscribe(responseData => {
      this.reservations = responseData.reservations
      console.log(responseData.reservations)
      this.reservationsUpdated.next([...this.reservations])
    })
  }

  getPostUpdateListener() {
    return this.reservationsUpdated.asObservable()
  }

  updatedReservation(id: string, reservationUpdate: any) {
    this.http.patch<{message: string, reservation: Reservation}>(environment.apiUrl + '/api/reservations/'+id, reservationUpdate).subscribe(resData => {
      let updatedReservations = this.reservations.filter(reservation => reservation._id !== id)
      console.log("updatedReservations")
      console.log(updatedReservations)
      updatedReservations.push(resData.reservation)
      this.reservations = updatedReservations
      this.reservationsUpdated.next([...this.reservations])
    })
  }

  deleteReservation(id: string) {
    this.http.delete<{action:string}>(environment.apiUrl + '/api/reservations/'+id).subscribe(responseData => {
      if (responseData.action === "deleted"){
        const updatedReservations = this.reservations.filter(reservation => reservation._id !== id)
        this.reservations = updatedReservations
        this.reservationsUpdated.next([...this.reservations])
      }
    })
  }

}
