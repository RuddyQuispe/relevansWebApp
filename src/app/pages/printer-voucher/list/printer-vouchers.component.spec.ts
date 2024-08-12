import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterVouchersComponent } from './printer-vouchers.component';

describe('PrinterVoucherComponent', () => {
  let component: PrinterVouchersComponent;
  let fixture: ComponentFixture<PrinterVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrinterVouchersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinterVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
