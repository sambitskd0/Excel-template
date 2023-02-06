import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApprovedListComponent } from './view-approved-list.component';

describe('ViewApprovedListComponent', () => {
  let component: ViewApprovedListComponent;
  let fixture: ComponentFixture<ViewApprovedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApprovedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApprovedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
