import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnnextureMasterComponent } from './edit-annexture-master.component';

describe('EditAnnextureMasterComponent', () => {
  let component: EditAnnextureMasterComponent;
  let fixture: ComponentFixture<EditAnnextureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAnnextureMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnnextureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
