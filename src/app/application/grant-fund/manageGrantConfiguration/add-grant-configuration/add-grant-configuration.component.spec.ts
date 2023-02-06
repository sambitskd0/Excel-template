import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGrantConfigurationComponent } from './add-grant-configuration.component';

describe('AddGrantConfigurationComponent', () => {
  let component: AddGrantConfigurationComponent;
  let fixture: ComponentFixture<AddGrantConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGrantConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGrantConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
