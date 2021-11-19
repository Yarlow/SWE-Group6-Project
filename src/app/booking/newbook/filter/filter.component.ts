import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider'
import { HotelService } from 'src/app/service/hotel.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css', './filter.component.scss']
})
export class FilterComponent implements OnInit {
  showFilter: boolean = false;
  form: FormGroup;
  showWeekdaySlider: boolean = false;
  showPriceSlider: boolean = false;

  value: number = 100;
  priceSliderOptions: Options = {
    floor: 0,
    ceil: 300
  }
  bedOptions: string[] = ['Any', 'Standard', 'Queen', 'King']
  amenities: string[] = ['Gym', 'Spa', 'Pool', 'Business Office', 'WiFi']
  selected = -1;

  constructor(private hotelService: HotelService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'hotelName': new FormControl(),
      'priceSlider' : new FormControl([0,300]),
      'selectedAmenities' : new FormControl(),
      'selectedBed' : new FormControl('Any'),
      // 'weekendPricingCheckbox' : new FormControl(),
      'startDate': new FormControl(),
      'endDate': new FormControl()
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
    if (this.form.value.priceSlider[0]>0 || this.form.value.priceSlider[1]<300){
      urlParam = {...urlParam, minPrice:this.form.value.priceSlider[0]}
      urlParam = {...urlParam, maxPrice:this.form.value.priceSlider[1]}
    }
    if (this.form.value.selectedBed) {
      if (this.form.value.selectedBed === "Any"){
        urlParam = {...urlParam, bed: "Any"}
      } else {
        urlParam = {...urlParam, bed: this.form.value.selectedBed}
      }
    }
    if (this.form.value.startDate || this.form.value.endDate) {
      if (!this.form.value.startDate || !this.form.value.endDate) {
        this.snackBar.open('Must have both start and end dates', '', { duration: 3000 })
        return
      } else {
        urlParam = {
          ...urlParam,
          startDate: this.form.value.startDate,
          endDate: this.form.value.endDate
        }
      }
    }

    this.router.navigate(['/reservations/new'], {queryParams: urlParam})
    // let userFilter = {
    //   nameFilter: this.form.value.hotelName,
    //   priceSliderCheckbox: this.form.value.weekendPricingCheckbox,
    //   priceFilter: [this.form.value.priceSlider[0], this.form.value.priceSlider[1]],
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
    this.router.navigate(['/reservations/new'])
    this.form.reset({priceSlider: [0, 300]})
    this.form.patchValue({'selectedBed':"Any"})
    let urlParam = { bed: "Any"}

    this.hotelService.filterHotels(urlParam)

  }

}
