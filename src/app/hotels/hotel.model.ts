export interface Hotel {
  _id: string,
  name: string,
  rooms: number,
  price: {
    standard: number,
    queen: number,
    king: number,
    weekendSurcharge: number
  },
  amenities: string[],
  // imagePath: string
}
