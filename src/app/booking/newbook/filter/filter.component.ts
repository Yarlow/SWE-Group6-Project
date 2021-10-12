import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider'
import { HotelService } from 'src/app/service/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css', './filter.component.scss']
})
export class FilterComponent implements OnInit {
  showFilter: boolean = false;
  form: FormGroup;
  showWeekdaySlider: boolean = false;
  showWeekendSlider: boolean = false;

  value: number = 100;
  priceSliderOptions: Options = {
    floor: 0,
    ceil: 1000
  }
  bedOptions: string[] = ['Any', 'Standard', 'Queen', 'King']
  amenities: string[] = ['Pool', 'Spa', 'Breakfast', 'A 15 inch dildo in the nightstand']
  selected = -1;

  constructor(private hotelService: HotelService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'hotelName': new FormControl(),
      'weekdayPrice' : new FormControl([0, 200]),
      'weekendPrice' : new FormControl([0,1000]),
      'selectedAmenities' : new FormControl(),
      'selectedBed' : new FormControl('Any'),
      'weekendPricingCheckbox' : new FormControl()
    })
  }

  onFilter() {
    let urlParam = {}
    if (this.form.value.hotelName) {
      console.log("VALUE  " + this.form.value.hotelName)
      // urlParam += "hotel="+this.form.value.hotelName
      urlParam = { ...urlParam, hotelName:this.form.value.hotelName}
    }
    if (this.form.value.selectedAmenities){
      console.log("AMENITIES FOUDN " + this.form.value.selectedAmenities)
      urlParam = {...urlParam, amenities:this.form.value.selectedAmenities}
    }
    if (this.form.value.weekendPrice[0]>0 || this.form.value.weekendPrice[1]<1000){
      urlParam = {...urlParam, minPrice:this.form.value.weekendPrice[0]}
      urlParam = {...urlParam, maxPrice:this.form.value.weekendPrice[1]}
    }
    if (this.form.value.selectedBed) {
      if (this.form.value.selectedBed === "any"){
        urlParam = {...urlParam, bed: "all"}
      } else {
        urlParam = {...urlParam, bed: this.form.value.selectedBed}
      }
    }
    this.router.navigate(['/reservations/new'], {queryParams: urlParam})
    // let userFilter = {
    //   nameFilter: this.form.value.hotelName,
    //   weekendPriceCheckbox: this.form.value.weekendPricingCheckbox,
    //   priceFilter: [this.form.value.weekendPrice[0], this.form.value.weekendPrice[1]],
    //   amenities: [this.form.value.selectedAmenities]
    // }
    // console.log("FILTER "+ userFilter)
    // if (userFilter.nameFilter){
    //   console.log("Name filter true???" + userFilter.nameFilter)
    // }
    // if (userFilter.priceFilter){
    //   console.log("Price filter true???" + userFilter.priceFilter)
    // }
    console.log(this.form.value.weekendPricingCheckbox)
    this.hotelService.filterHotels(urlParam)

  }

  onChange(amenity: string){
    console.log(amenity)
  }

  onClearForm() {
    this.form.reset({weekendPrice: [0, 1000]})
  }

}
