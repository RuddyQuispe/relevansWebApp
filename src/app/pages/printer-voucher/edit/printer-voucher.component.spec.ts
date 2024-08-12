import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterVoucherComponent } from './printer-voucher.component';

describe('EditComponent', () => {
  let component: PrinterVoucherComponent;
  let fixture: ComponentFixture<PrinterVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrinterVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
