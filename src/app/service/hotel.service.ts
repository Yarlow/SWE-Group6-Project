import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Hotel } from '../hotels/hotel.model';


import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  // hotels: Hotel[] = [
  //   {
  //     name: "Jacob Hotel",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   }, {
  //     name: "Alex Hotel",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   }, {
  //     name: "Stephen Hotel",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   }, {
  //     name: "Blair Hotel",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   },{
  //     name: "SPACE HOTEL",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   }, {
  //     name: "More tests",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   },
  //   {
  //     name: "More tests",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   },  {
  //     name: "More tests",
  //     rooms: 8,
  //     price: {
  //       standard: 100,
  //       queen: 100,
  //       king: 200,
  //       weekendSurcharge: 0.05
  //     },
  //     amenities: ["breakfast"],
  //     imagePath: "assets/Boardwalk.jpg"
  //   }
  // ]

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

  filterHotels(userFilter: {nameFilter:string, priceFilter: number[], }) {
    // this.hotelsForView = this.hotels.filter(function(hotel) {
    //   return hotel.name.toLowerCase().includes(userFilter.nameFilter.toLowerCase()) && hotel.pricePerNightWeekday > userFilter.priceFilter[0] && hotel.pricePerNightWeekday < userFilter.priceFilter[1]
    // })
    // console.log(this.hotelsForView)
    // this.hotelsUpdated.next([...this.hotelsForView])
  }

}
