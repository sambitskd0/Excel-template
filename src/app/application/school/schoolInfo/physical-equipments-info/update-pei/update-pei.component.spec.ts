import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePeiComponent } from './update-pei.component';

describe('UpdatePeiComponent', () => {
  let component: UpdatePeiComponent;
  let fixture: ComponentFixture<UpdatePeiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePeiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
