import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUsComponent } from './home-us.component';

describe('HomeUsComponent', () => {
  let component: HomeUsComponent;
  let fixture: ComponentFixture<HomeUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
