import { Component, Input, OnInit } from '@angular/core';
import { Hotel } from '../../hotel.model';

@Component({
  selector: 'app-hotel-list-item',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {

  @Input() hotelElement: Hotel;

  constructor() { }

  ngOnInit(): void {
    console.log(this.hotelElement)
  }

}
