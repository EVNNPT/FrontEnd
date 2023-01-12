import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuongDayDetailComponent } from './duong-day-detail.component';

describe('DuongDayDetailComponent', () => {
  let component: DuongDayDetailComponent;
  let fixture: ComponentFixture<DuongDayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuongDayDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuongDayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
