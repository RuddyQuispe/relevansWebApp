import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherListFilterComponent } from './voucher-list-filter.component';

describe('SaleListFilterComponent', () => {
  let component: VoucherListFilterComponent;
  let fixture: ComponentFixture<VoucherListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherListFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
