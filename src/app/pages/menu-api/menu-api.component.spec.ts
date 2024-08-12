import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuApiComponent } from './menu-api.component';

describe('MenuApiComponent', () => {
  let component: MenuApiComponent;
  let fixture: ComponentFixture<MenuApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuApiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
