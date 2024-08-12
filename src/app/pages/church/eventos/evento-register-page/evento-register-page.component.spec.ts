import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoRegisterPageComponent } from './evento-register-page.component';

describe('EventoRegisterPageComponent', () => {
  let component: EventoRegisterPageComponent;
  let fixture: ComponentFixture<EventoRegisterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventoRegisterPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventoRegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
