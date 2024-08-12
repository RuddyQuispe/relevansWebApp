import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovateVouchersComponent } from './renovate-vouchers.component';

describe('RenovateVoucherComponent', () => {
  let component: RenovateVouchersComponent;
  let fixture: ComponentFixture<RenovateVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovateVouchersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovateVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
