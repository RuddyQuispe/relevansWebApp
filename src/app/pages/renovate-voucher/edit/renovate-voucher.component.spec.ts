import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovateVoucherComponent } from './renovate-voucher.component';

describe('EditComponent', () => {
  let component: RenovateVoucherComponent;
  let fixture: ComponentFixture<RenovateVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenovateVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenovateVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
