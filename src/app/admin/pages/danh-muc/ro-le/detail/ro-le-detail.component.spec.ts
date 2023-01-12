import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoLeDetailComponent } from './ro-le-detail.component';

describe('RoLeDetailComponent', () => {
  let component: RoLeDetailComponent;
  let fixture: ComponentFixture<RoLeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoLeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoLeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
