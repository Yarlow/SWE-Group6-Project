import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingpopupComponent } from './bookingpopup.component';

describe('BookingpopupComponent', () => {
  let component: BookingpopupComponent;
  let fixture: ComponentFixture<BookingpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
