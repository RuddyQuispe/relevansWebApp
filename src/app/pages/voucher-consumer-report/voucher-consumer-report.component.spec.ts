import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherConsumerReportComponent } from './voucher-consumer-report.component';

describe('VoucherConsumerReportComponent', () => {
  let component: VoucherConsumerReportComponent;
  let fixture: ComponentFixture<VoucherConsumerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherConsumerReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherConsumerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
