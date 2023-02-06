import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContextTaggingComponent } from './edit-context-tagging.component';

describe('EditContextTaggingComponent', () => {
  let component: EditContextTaggingComponent;
  let fixture: ComponentFixture<EditContextTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditContextTaggingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContextTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
