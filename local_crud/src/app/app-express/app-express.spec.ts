import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppExpress } from './app-express';

describe('AppExpress', () => {
  let component: AppExpress;
  let fixture: ComponentFixture<AppExpress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppExpress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppExpress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
