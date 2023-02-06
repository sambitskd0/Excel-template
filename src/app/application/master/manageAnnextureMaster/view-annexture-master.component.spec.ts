import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnextureMasterComponent } from './view-annexture-master.component';

describe('ViewAnnextureMasterComponent', () => {
  let component: ViewAnnextureMasterComponent;
  let fixture: ComponentFixture<ViewAnnextureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAnnextureMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnnextureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
