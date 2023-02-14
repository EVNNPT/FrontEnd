import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelDetailComponent } from './label-detail.component';

describe('LabelDetailComponent', () => {
  let component: LabelDetailComponent;
  let fixture: ComponentFixture<LabelDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
