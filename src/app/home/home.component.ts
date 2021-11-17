import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  constructor() { }

  val = 0;

  ngOnInit(): void {
  }

  addVal() {
    this.val++;
    console.log(this.val)
  }

}
