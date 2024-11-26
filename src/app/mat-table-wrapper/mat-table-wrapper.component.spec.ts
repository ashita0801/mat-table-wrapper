import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableWrapperComponent } from './mat-table-wrapper.component';

describe('MatTableWrapperComponent', () => {
  let component: MatTableWrapperComponent;
  let fixture: ComponentFixture<MatTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
