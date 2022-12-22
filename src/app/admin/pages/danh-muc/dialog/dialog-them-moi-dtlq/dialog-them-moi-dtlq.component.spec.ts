import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogThemMoiDtlqComponent } from './dialog-them-moi-dtlq.component';

describe('DialogThemMoiDtlqComponent', () => {
  let component: DialogThemMoiDtlqComponent;
  let fixture: ComponentFixture<DialogThemMoiDtlqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogThemMoiDtlqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogThemMoiDtlqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
