import { Hotel } from "../hotels/hotel.model";

export interface Reservation {
  _id: string
  hotel: Hotel,
  startDate: Date,
  endDate: Date,
  price: number
}
