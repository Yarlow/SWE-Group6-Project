import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Hotel } from '../hotels/hotel.model';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  hotels: Hotel[] = [
    {
      name: "Jacob Hotel",
      location: "Boerne",
      roomsAvailable: 10,
      pricePerNightWeekend: 150,
      pricePerNightWeekday: 100,
      amenities: ["gym", "pool"]
    }, {
      name: "Alex Hotel",
      location: "San Antonio",
      roomsAvailable: 2,
      pricePerNightWeekend: 89,
      pricePerNightWeekday: 50,
      amenities: ["pool"]
    }, {
      name: "Stephen Hotel",
      location: "Houston",
      roomsAvailable: 8,
      pricePerNightWeekend: 800,
      pricePerNightWeekday: 500,
      amenities: ["pool", "gym", "spa", "breakfast", "WiFi"]
    }, {
      name: "Blair Hotel",
      location: "Dallas",
      roomsAvailable: 15,
      pricePerNightWeekend: 100,
      pricePerNightWeekday: 120,
      amenities: ["breakfast", "gym", "spa"]
    }, {
      name: "More tests",
      location: "Yo momma",
      roomsAvailable: 8,
      pricePerNightWeekend: 3,
      pricePerNightWeekday: 0,
      amenities: ["breakfast", 'A 15 inch dildo in the nightstand']
    },
    {
      name: "More tests",
      location: "New Vegas",
      roomsAvailable: 2,
      pricePerNightWeekend: 50,
      pricePerNightWeekday: 60,
      amenities: ["babooshka"]
    }, {
      name: "More tests",
      location: "TEST",
      roomsAvailable: 8,
      pricePerNightWeekend: 3000,
      pricePerNightWeekday: 4510,
      amenities: ["breakfast"]
    }
  ]

  private hotelsForView: Hotel[];

  //  DELTE ABOVE ARRAY EVENTUALLY

  private hotelsUpdated = new Subject<Hotel[]>()

  constructor() { }


  getHotels() {
    this.hotelsForView = this.hotels
    return this.hotelsForView
  }

  getHotelUpdateListener() {
    return this.hotelsUpdated.asObservable()
  }

  filterHotels(userFilter: {nameFilter:string, priceFilter: number[], }) {
    this.hotelsForView = this.hotels.filter(function(hotel) {
      return hotel.name.toLowerCase().includes(userFilter.nameFilter.toLowerCase()) && hotel.pricePerNightWeekday > userFilter.priceFilter[0] && hotel.pricePerNightWeekday < userFilter.priceFilter[1]
    })
    console.log(this.hotelsForView)
    this.hotelsUpdated.next([...this.hotelsForView])
  }

}
