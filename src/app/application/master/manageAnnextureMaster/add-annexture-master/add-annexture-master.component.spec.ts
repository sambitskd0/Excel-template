import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnextureMasterComponent } from './add-annexture-master.component';

describe('AddAnnextureMasterComponent', () => {
  let component: AddAnnextureMasterComponent;
  let fixture: ComponentFixture<AddAnnextureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnnextureMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnnextureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
