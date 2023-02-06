import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrantConfigurationComponent } from './edit-grant-configuration.component';

describe('EditGrantConfigurationComponent', () => {
  let component: EditGrantConfigurationComponent;
  let fixture: ComponentFixture<EditGrantConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGrantConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrantConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
