import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightsComponent } from './rights.component';

describe('RightsComponent', () => {
  let component: RightsComponent;
  let fixture: ComponentFixture<RightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
