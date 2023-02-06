import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarkconfigurationComponent } from './edit-markconfiguration.component';

describe('EditMarkconfigurationComponent', () => {
  let component: EditMarkconfigurationComponent;
  let fixture: ComponentFixture<EditMarkconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMarkconfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMarkconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
