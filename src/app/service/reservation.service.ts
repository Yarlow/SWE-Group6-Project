import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

}
