import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFamilyComponent } from './search-family.component';

describe('SearchFamilyComponent', () => {
  let component: SearchFamilyComponent;
  let fixture: ComponentFixture<SearchFamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
