import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBasedEducationComponent } from './home-based-education.component';

describe('HomeBasedEducationComponent', () => {
  let component: HomeBasedEducationComponent;
  let fixture: ComponentFixture<HomeBasedEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeBasedEducationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBasedEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
