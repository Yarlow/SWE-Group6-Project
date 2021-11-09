import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Hotel } from '../hotels/hotel.model';


import { map } from 'rxjs/operators'
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private hotels: Hotel[] = [];

  private hotelsForView: Hotel[];

  //  DELTE ABOVE ARRAY EVENTUALLY

  private hotelsUpdated = new Subject<Hotel[]>()

  constructor(private http: HttpClient) { }


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


  getHotelUpdateListener() {
    return this.hotelsUpdated.asObservable()
  }

  filterHotels(userFilter:any) {
    let params = new HttpParams()
    console.log(userFilter)
    params = userFilter
    console.log("PARAMS " + params)
    this.http.get<{hotels: Hotel[]}>('http://localhost:3000/api/hotels/search', {params: userFilter})
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

  createHotel(hotel){
    this.http.post<{message: string}>('http://localhost:3000/api/hotels', hotel).subscribe(responseData => {
      console.log(responseData)
    })
  }

}
