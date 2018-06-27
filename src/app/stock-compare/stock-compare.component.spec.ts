import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCompareComponent } from './stock-compare.component';

describe('StockCompareComponent', () => {
  let component: StockCompareComponent;
  let fixture: ComponentFixture<StockCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
