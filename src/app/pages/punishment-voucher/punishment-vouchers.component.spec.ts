import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunishmentVouchersComponent } from './punishment-vouchers.component';

describe('PunishmentVouchersComponent', () => {
  let component: PunishmentVouchersComponent;
  let fixture: ComponentFixture<PunishmentVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PunishmentVouchersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunishmentVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
