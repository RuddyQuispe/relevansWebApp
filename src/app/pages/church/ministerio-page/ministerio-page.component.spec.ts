import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinisterioPageComponent } from './ministerio-page.component';

describe('MinisterioPageComponent', () => {
  let component: MinisterioPageComponent;
  let fixture: ComponentFixture<MinisterioPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinisterioPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinisterioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
