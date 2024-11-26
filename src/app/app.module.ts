import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatTableWrapperComponent } from './mat-table-wrapper/mat-table-wrapper.component';

@NgModule({
  declarations: [MatTableWrapperComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [MatTableWrapperComponent],
})
export class AppModule {}
