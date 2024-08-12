import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancionPageComponent } from './cancion-page.component';

describe('CancionPageComponent', () => {
  let component: CancionPageComponent;
  let fixture: ComponentFixture<CancionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
