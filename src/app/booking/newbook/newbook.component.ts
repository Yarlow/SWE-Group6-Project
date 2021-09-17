import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newbook',
  templateUrl: './newbook.component.html',
  styleUrls: ['./newbook.component.css']
})
export class NewbookComponent implements OnInit {

  showFilter: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
