import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogXoaDtlqComponent } from './dialog-xoa-dtlq.component';

describe('DialogXoaDtlqComponent', () => {
  let component: DialogXoaDtlqComponent;
  let fixture: ComponentFixture<DialogXoaDtlqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogXoaDtlqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogXoaDtlqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
