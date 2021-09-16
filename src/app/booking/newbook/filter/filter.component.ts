import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider'
import { HotelService } from 'src/app/service/hotel.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css', './filter.component.scss']
})
export class FilterComponent implements OnInit {
  form: FormGroup;

  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  }

  amenities: string[] = ['Pool', 'Spa', 'Breakfast', 'A 15 inch dildo in the nightstand']
  selected = -1;

  constructor(private hotelService: HotelService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'hotelName': new FormControl(),
      'valueSlider' : new FormControl([0, 200])
    })
  }

  onSearch(){
    console.log(this.form.value.valueSlider[0])
    console.log(this.form.value.valueSlider[1])
    console.log(this.form)
  }

  onFilter() {
    let userFilter = {
      nameFilter: this.form.value.hotelName,
      priceFilter: [this.form.value.valueSlider[0], this.form.value.valueSlider[1]]
    }

    this.hotelService.filterHotels(userFilter)

  }

  onChange(amenity: string){
    console.log(amenity)
  }

}
