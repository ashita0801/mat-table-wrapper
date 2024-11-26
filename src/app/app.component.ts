import { Component } from '@angular/core';
import { MatTableWrapperComponent } from './mat-table-wrapper/mat-table-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTableWrapperComponent],
  template: `
    <app-mat-table-wrapper></app-mat-table-wrapper>
  `
})
export class AppComponent {
  title = 'mat-table-wrapper';
}
