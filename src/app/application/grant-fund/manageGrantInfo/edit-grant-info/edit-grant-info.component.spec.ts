import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantInfoComponent } from './edit-grant-info.component';

describe('EditGrantInfoComponent', () => {
  let component: EditGrantInfoComponent;
  let fixture: ComponentFixture<EditGrantInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
