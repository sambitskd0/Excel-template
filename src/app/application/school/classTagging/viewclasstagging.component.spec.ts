import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewclasstaggingComponent } from './viewclasstagging.component';

describe('ViewclasstaggingComponent', () => {
  let component: ViewclasstaggingComponent;
  let fixture: ComponentFixture<ViewclasstaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewclasstaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewclasstaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
