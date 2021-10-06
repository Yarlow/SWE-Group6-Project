import { Component, Input, OnInit } from '@angular/core';
import { Hotel } from '../../hotel.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BookingpopupComponent } from 'src/app/booking/newbook/bookingpopup/bookingpopup.component';

export interface DialogData {
  hotel: Hotel
}


@Component({
  selector: 'app-hotel-list-item',
  templateUrl: './hotel-list-item.component.html',
  styleUrls: ['./hotel-list-item.component.css']
})
export class HotelListItemComponent implements OnInit {

  @Input() hotelElement: Hotel;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onStartBook() {
    const dialogRef = this.dialog.open(BookingpopupComponent, {
      data: {
        hotel: this.hotelElement
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Dialog was closed');
    })

  }

}
