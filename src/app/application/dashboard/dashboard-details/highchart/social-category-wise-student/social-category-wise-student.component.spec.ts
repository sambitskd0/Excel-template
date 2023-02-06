import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialCategoryWiseStudentComponent } from './social-category-wise-student.component';

describe('SocialCategoryWiseStudentComponent', () => {
  let component: SocialCategoryWiseStudentComponent;
  let fixture: ComponentFixture<SocialCategoryWiseStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialCategoryWiseStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialCategoryWiseStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
