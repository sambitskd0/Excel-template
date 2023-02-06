import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommitteeMeetingComponent } from './view-committee-meeting.component';

describe('ViewCommitteeMeetingComponent', () => {
  let component: ViewCommitteeMeetingComponent;
  let fixture: ComponentFixture<ViewCommitteeMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCommitteeMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommitteeMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
