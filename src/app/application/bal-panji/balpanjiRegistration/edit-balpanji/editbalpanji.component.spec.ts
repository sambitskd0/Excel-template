import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditbalpanjiComponent } from './editbalpanji.component';

describe('EditbalpanjiComponent', () => {
  let component: EditbalpanjiComponent;
  let fixture: ComponentFixture<EditbalpanjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditbalpanjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditbalpanjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
