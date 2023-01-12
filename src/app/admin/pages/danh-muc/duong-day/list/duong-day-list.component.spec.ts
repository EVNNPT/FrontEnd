import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuongDayListComponent } from './duong-day-list.component';

describe('DuongDayListComponent', () => {
  let component: DuongDayListComponent;
  let fixture: ComponentFixture<DuongDayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuongDayListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuongDayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
