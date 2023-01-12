import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoLeListComponent } from './ro-le-list.component';

describe('RoLeListComponent', () => {
  let component: RoLeListComponent;
  let fixture: ComponentFixture<RoLeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoLeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoLeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
