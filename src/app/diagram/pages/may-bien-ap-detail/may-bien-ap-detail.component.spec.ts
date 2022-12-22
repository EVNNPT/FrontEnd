import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayBienApDetailComponent } from './may-bien-ap-detail.component';

describe('MayBienApDetailComponent', () => {
  let component: MayBienApDetailComponent;
  let fixture: ComponentFixture<MayBienApDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayBienApDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MayBienApDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
