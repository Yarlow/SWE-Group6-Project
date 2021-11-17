import { Hotel } from "../hotels/hotel.model";
import { User } from "../user/user.model";

export interface Reservation {
  _id: string
  hotel: Hotel,
  startDate: Date,
  endDate: Date,
  price: number,
  bedChoice: string,
  room: string,
  user: User
}
