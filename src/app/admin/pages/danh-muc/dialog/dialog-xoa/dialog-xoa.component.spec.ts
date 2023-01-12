import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogXoaComponent } from './dialog-xoa.component';

describe('DialogXoaComponent', () => {
  let component: DialogXoaComponent;
  let fixture: ComponentFixture<DialogXoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogXoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogXoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
