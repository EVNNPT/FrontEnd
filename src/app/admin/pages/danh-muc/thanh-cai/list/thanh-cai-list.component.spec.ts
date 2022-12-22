import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanhCaiListComponent } from './thanh-cai-list.component';

describe('ThanhCaiListComponent', () => {
  let component: ThanhCaiListComponent;
  let fixture: ComponentFixture<ThanhCaiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThanhCaiListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThanhCaiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
