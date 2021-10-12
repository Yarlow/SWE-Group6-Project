import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagebooklistComponent } from './managebooklist.component';

describe('ManagebooklistComponent', () => {
  let component: ManagebooklistComponent;
  let fixture: ComponentFixture<ManagebooklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagebooklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagebooklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
