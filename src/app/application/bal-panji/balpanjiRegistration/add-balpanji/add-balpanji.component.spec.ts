import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBalpanjiComponent } from './add-balpanji.component';

describe('AddBalpanjiComponent', () => {
  let component: AddBalpanjiComponent;
  let fixture: ComponentFixture<AddBalpanjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBalpanjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBalpanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
