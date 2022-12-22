import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanhCaiDetailComponent } from './thanh-cai-detail.component';

describe('ThanhCaiDetailComponent', () => {
  let component: ThanhCaiDetailComponent;
  let fixture: ComponentFixture<ThanhCaiDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanhCaiDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanhCaiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
