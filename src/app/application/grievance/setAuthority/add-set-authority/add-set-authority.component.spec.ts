import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSetAuthorityComponent } from './add-set-authority.component';

describe('AddSetAuthorityComponent', () => {
  let component: AddSetAuthorityComponent;
  let fixture: ComponentFixture<AddSetAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSetAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSetAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
