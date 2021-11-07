import { Reservation } from "../booking/reservation.model";
import { Hotel } from "../hotels/hotel.model";

export interface User {
  _id: string,
  username: string,
  reservations: Reservation[],
  managerOf: Hotel[],
  role: string
}
