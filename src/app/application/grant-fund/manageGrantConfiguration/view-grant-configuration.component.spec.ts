import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGrantConfigurationComponent } from './view-grant-configuration.component';

describe('ViewGrantConfigurationComponent', () => {
  let component: ViewGrantConfigurationComponent;
  let fixture: ComponentFixture<ViewGrantConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGrantConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGrantConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
