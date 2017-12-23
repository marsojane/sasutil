import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmqueueComponent } from './cmqueue.component';

describe('CmqueueComponent', () => {
  let component: CmqueueComponent;
  let fixture: ComponentFixture<CmqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
