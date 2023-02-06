import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePfiComponent } from './update-pfi.component';

describe('UpdatePfiComponent', () => {
  let component: UpdatePfiComponent;
  let fixture: ComponentFixture<UpdatePfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePfiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
