import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSetAuthorityComponent } from './view-set-authority.component';

describe('ViewSetAuthorityComponent', () => {
  let component: ViewSetAuthorityComponent;
  let fixture: ComponentFixture<ViewSetAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSetAuthorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSetAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
