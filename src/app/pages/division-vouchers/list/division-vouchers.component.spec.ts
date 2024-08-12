import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionVouchersComponent } from './division-vouchers.component';

describe('DivisionVouchersComponent', () => {
  let component: DivisionVouchersComponent;
  let fixture: ComponentFixture<DivisionVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionVouchersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
