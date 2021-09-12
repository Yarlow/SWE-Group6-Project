import { Injectable } from '@angular/core';
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
      amenities: ["breakfast"]
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
  constructor() { }


  getHotels() {
    console.log(this.hotels)
    return this.hotels;
  }

}
