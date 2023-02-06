import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdmServedComponent } from './mdm-served.component';

describe('MdmServedComponent', () => {
  let component: MdmServedComponent;
  let fixture: ComponentFixture<MdmServedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdmServedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdmServedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
