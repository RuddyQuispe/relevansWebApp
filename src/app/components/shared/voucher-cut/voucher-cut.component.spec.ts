import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherCutComponent } from './voucher-cut.component';

describe('VoucherCutComponent', () => {
  let component: VoucherCutComponent;
  let fixture: ComponentFixture<VoucherCutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherCutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
