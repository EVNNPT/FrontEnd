import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepolistComponent } from './repolist.component';

describe('RepolistComponent', () => {
  let component: RepolistComponent;
  let fixture: ComponentFixture<RepolistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepolistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
