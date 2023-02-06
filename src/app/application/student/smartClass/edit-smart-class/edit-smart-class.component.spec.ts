import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSmartClassComponent } from './edit-smart-class.component';

describe('EditSmartClassComponent', () => {
  let component: EditSmartClassComponent;
  let fixture: ComponentFixture<EditSmartClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSmartClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSmartClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
