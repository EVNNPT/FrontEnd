import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayBienApListComponent } from './may-bien-ap-list.component';

describe('MayBienApListComponent', () => {
  let component: MayBienApListComponent;
  let fixture: ComponentFixture<MayBienApListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayBienApListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MayBienApListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
