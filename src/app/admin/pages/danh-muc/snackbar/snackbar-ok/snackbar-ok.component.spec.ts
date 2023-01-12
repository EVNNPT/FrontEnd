import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarOkComponent } from './snackbar-ok.component';

describe('SnackbarOkComponent', () => {
  let component: SnackbarOkComponent;
  let fixture: ComponentFixture<SnackbarOkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarOkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackbarOkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
