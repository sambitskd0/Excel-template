import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrantInfoComponent } from './add-grant-info.component';

describe('AddGrantInfoComponent', () => {
  let component: AddGrantInfoComponent;
  let fixture: ComponentFixture<AddGrantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrantInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
