import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContextTaggingComponent } from './add-context-tagging.component';

describe('AddContextTaggingComponent', () => {
  let component: AddContextTaggingComponent;
  let fixture: ComponentFixture<AddContextTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContextTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
