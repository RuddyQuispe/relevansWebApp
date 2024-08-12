import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionVoucherComponent } from './division-voucher.component';

describe('DivisionVoucherComponent', () => {
  let component: DivisionVoucherComponent;
  let fixture: ComponentFixture<DivisionVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
