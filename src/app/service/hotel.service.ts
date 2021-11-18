import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Hotel } from '../hotels/hotel.model';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators'
import { HttpClient, HttpParams } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './user.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private hotels: Hotel[] = [];

  private hotelsForView: Hotel[];

  //  DELTE ABOVE ARRAY EVENTUALLY

  private hotelsUpdated = new Subject<Hotel[]>()

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService) { }


  getHotels() {
    this.http.get<{message: string, hotels: any}>('http://localhost:3000/api/hotels')
      .subscribe(hotelData => {
        this.hotels = hotelData.hotels;
        this.hotelsUpdated.next([...this.hotels])
      })

    //   .pipe(map((hotelData) => {
    //     return hotelData.hotels.map(hotel => {
    //       return {
    //         _id: hotel._id,
    //         name: hotel.name,
    //         rooms: hotel.rooms,
    //         price : {
    //           standard: hotel.price.standard,
    //           queen: hotel.price.queen,
    //           king: hotel.price.king,
    //           weekendSurcharge: hotel.price.weekendSurcharge
    //         },
    //         amenities: hotel.amenities
    //     }
    //   })
    //
    // // this.hotelsForView = this.hotels
    // // return this.hotelsForView
    // })).subscribe((transformedHotels) => {
    //   this.hotels = transformedHotels
    //   this.hotelsUpdated.next([...this.hotels])
    // })
  }

  getHotelById(hotelId) {
    console.log("Requesting")
    return this.http.get<{hotel: Hotel, managers: User[]}>('http://localhost:3000/api/hotels/search/one/' + hotelId)
  }


  getHotelUpdateListener() {
    return this.hotelsUpdated.asObservable()
  }

  filterHotels(userFilter:any) {
    let params = new HttpParams()
    console.log(userFilter)
    params = userFilter
    console.log("PARAMS " + params)
    // this.http.get<{message: string}>('http://localhost:3000/api/reservations/test/please/work').subscribe(
    //   responseData => {
    //     console.log(responseData)
    //   }
    // )
    this.http.get<{hotels: Hotel[], message: string}>('http://localhost:3000/api/hotels/search/filter', {params: userFilter})
      .subscribe(responseData => {
          this.hotels = responseData.hotels
          this.hotelsUpdated.next([...this.hotels])
    })
    // this.hotelsForView = this.hotels.filter(function(hotel) {
    //   return hotel.name.toLowerCase().includes(userFilter.nameFilter.toLowerCase()) && hotel.pricePerNightWeekday > userFilter.priceFilter[0] && hotel.pricePerNightWeekday < userFilter.priceFilter[1]
    // })
    // console.log(this.hotelsForView)
    // this.hotelsUpdated.next([...this.hotelsForView])
  }

  createHotel(hotel, managerUsernames){
    let body = {
      hotel,
      managerUsernames
    }
    this.http.post<{message: string, unFoundUsers: string[], createdHotel: Hotel}>('http://localhost:3000/api/hotels', body).subscribe(responseData => {
      console.log(responseData)
      if (responseData.unFoundUsers && responseData.unFoundUsers.length > 0){
        this.snackBar.open('Hotel Created - but some requested users dont exist: ' + responseData.unFoundUsers, 'X');
        this.router.navigate(['hotel/edit', responseData.createdHotel._id])
      } else {
          this.snackBar.open('Hotel Created', 'X');
          this.router.navigate(['/account'])
      }
    })
  }

  editHotel(hotel, managerUsernames, hotelId) {
    let body = {
      hotel,
      managerUsernames,
      hotelId
    }
    this.http.patch<{message: string, error: Error, }>('http://localhost:3000/api/hotels', body).subscribe(responseData => {
      if (responseData.message === 'success') {
        this.snackBar.open('Hotel Edited Successfully', 'X')
        let role = this.userService.getRole();
        if (role === 'admin'){
          this.snackBar.open('Hotel Edited', 'X');
          this.router.navigate(['/hotel/edit'])
        } else {
          this.snackBar.open('Hotel Edited', 'X');
          this.router.navigate(['/hotel/manager'])
        }
      }
      console.log(responseData)
    })
  }

  getManagerHotels() {
    let params = new HttpParams()
    let user = this.userService.getUser()
    let managerOf = user.managerOf
    console.log(managerOf)
    let urlParams: any = {
      hotelId: managerOf
    }
    params = urlParams

    console.log(urlParams)
    this.http.get<{hotels: Hotel[]}>('http://localhost:3000/api/hotels/search/manager', {params: urlParams}).subscribe(hotelData => {
      this.hotels = hotelData.hotels;
      this.hotelsUpdated.next([...this.hotels])
    })
  }

}
