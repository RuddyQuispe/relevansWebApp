import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateExcelComponent } from './template-excel.component';

describe('TemplateExcelComponent', () => {
  let component: TemplateExcelComponent;
  let fixture: ComponentFixture<TemplateExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
