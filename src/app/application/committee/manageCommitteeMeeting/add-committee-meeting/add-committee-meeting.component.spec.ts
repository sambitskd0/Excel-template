import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommitteeMeetingComponent } from './add-committee-meeting.component';

describe('AddCommitteeMeetingComponent', () => {
  let component: AddCommitteeMeetingComponent;
  let fixture: ComponentFixture<AddCommitteeMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommitteeMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommitteeMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
