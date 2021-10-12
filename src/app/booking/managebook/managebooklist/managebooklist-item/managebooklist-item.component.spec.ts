import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagebooklistItemComponent } from './managebooklist-item.component';

describe('ManagebooklistItemComponent', () => {
  let component: ManagebooklistItemComponent;
  let fixture: ComponentFixture<ManagebooklistItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagebooklistItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagebooklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
