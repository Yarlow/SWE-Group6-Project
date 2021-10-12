import { Hotel } from "../hotels/hotel.model";

export interface Reservation {
  hotel: Hotel,
  startDate: Date,
  endDate: Date,
  price: number
}
