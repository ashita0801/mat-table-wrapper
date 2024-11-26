import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface TableData {
  id: number;
  name: string;
  status: string;
  priority: string;
  isGroupHeader?: boolean; // Indicates if the row is a group header
}

@Component({
  selector: 'app-mat-table-wrapper',
  templateUrl: './mat-table-wrapper.component.html',
  styleUrls: ['./mat-table-wrapper.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    DragDropModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class MatTableWrapperComponent implements OnInit {
  /** Columns to display in the table. Includes checkboxes and drag handles. */
  displayedColumns: string[] = ['select', 'dragHandle', 'id', 'name', 'status', 'priority'];

  /** Columns available for grouping. Excludes the drag handle column. */
  availableColumns: string[] = [];

  /** Columns currently grouped by the user. */
  groupedColumns: string[] = [];

  /** Data source for the table. */
  dataSource = new MatTableDataSource<TableData>();

  /** Stores the original ungrouped data for restoring. */
  originalData: TableData[] = [];

  /** Manages row selection state. */
  selection = new SelectionModel<TableData>(true, []);

  /** Initialize component state and data. */
  ngOnInit() {
    // Initialize available columns (excluding drag handle)
    this.availableColumns = this.displayedColumns.filter(col => col !== 'dragHandle');

    // Sample data for the table
    const data: TableData[] = [
      { id: 1, name: 'Task 1', status: 'Open', priority: 'High' },
      { id: 2, name: 'Task 2', status: 'In Progress', priority: 'Medium' },
      { id: 3, name: 'Task 3', status: 'Open', priority: 'Low' },
      { id: 4, name: 'Task 4', status: 'Closed', priority: 'High' }
    ];

    // Save the original data for reference
    this.originalData = [...data];
    this.dataSource.data = data;
  }

  /** Checks if all rows are selected. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(row => !row.isGroupHeader).length;
    return numSelected === numRows;
  }

  /** Selects or deselects all rows. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    // Select all non-group-header rows
    const allNonGroupRows = this.dataSource.data.filter(row => !row.isGroupHeader);
    this.selection.select(...allNonGroupRows);
  }

  /** Provides the checkbox label for accessibility. */
  checkboxLabel(row?: TableData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  /** Handles column drag-and-drop for grouping and ungrouping. */
  onColumnDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Reorder within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Move columns between available and grouped lists
      const columnToMove = event.previousContainer.data[event.previousIndex];

      if (event.container.id === 'groupList') {
        // Move to grouped columns
        const index = this.availableColumns.indexOf(columnToMove);
        if (index !== -1) {
          this.availableColumns.splice(index, 1);
          this.groupedColumns.push(columnToMove);
        }
      } else if (event.container.id === 'availableList') {
        // Move to available columns
        const index = this.groupedColumns.indexOf(columnToMove);
        if (index !== -1) {
          this.groupedColumns.splice(index, 1);
          this.availableColumns.push(columnToMove);
        }
      }

      this.updateGrouping();
    }
  }

  /** Handles row drag-and-drop within or between groups. */
  onRowDrop(event: CdkDragDrop<TableData[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const rows = this.dataSource.data;

    if (rows[event.previousIndex].isGroupHeader) {
      // Prevent moving group headers
      return;
    }

    if (this.groupedColumns.length > 0) {
      // Restrict movement to within the same group
      const prevGroupIndex = this.findGroupIndex(rows, event.previousIndex);
      const newGroupIndex = this.findGroupIndex(rows, event.currentIndex);

      if (prevGroupIndex === newGroupIndex) {
        moveItemInArray(rows, event.previousIndex, event.currentIndex);
        this.dataSource.data = [...rows];
      }
    } else {
      // Free movement when not grouped
      moveItemInArray(rows, event.previousIndex, event.currentIndex);
      this.dataSource.data = [...rows];
    }
  }

  /** Removes a column from the grouped columns list. */
  removeGrouping(column: string) {
    const index = this.groupedColumns.indexOf(column);
    if (index >= 0) {
      this.groupedColumns.splice(index, 1);
      this.availableColumns.push(column);
      this.updateGrouping();
    }
  }

  /** Updates the table data based on current groupings. */
  private updateGrouping() {
    if (this.groupedColumns.length === 0) {
      // Restore original ungrouped data
      this.dataSource.data = [...this.originalData];
      return;
    }

    // Group the data and create group headers
    const groupedData = this.groupData(this.originalData);
    const newData: any[] = [];

    groupedData.forEach((items, groupKey) => {
      // Add group header
      newData.push({
        isGroupHeader: true,
        groupValue: groupKey,
        id: '',
        name: `Group: ${groupKey}`,
        status: `(${items.length} items)`,
        priority: ''
      });

      // Add group items
      newData.push(...items);
    });

    this.dataSource.data = newData;
  }

  /** Groups the data based on the selected columns. */
  private groupData(data: TableData[]): Map<string, TableData[]> {
    const groups = new Map<string, TableData[]>();

    data.forEach(item => {
      const groupKey = this.groupedColumns
        .map(col => item[col as keyof TableData])
        .join(' - ');

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push({ ...item });
    });

    return groups;
  }

  /** Finds the index of the group header for a row. */
  private findGroupIndex(rows: any[], index: number): number {
    for (let i = index; i >= 0; i--) {
      if (rows[i].isGroupHeader) {
        return i;
      }
    }
    return -1;
  }

  /** Checks if a row is a group header. */
  isGroupHeader(row: any): boolean {
    return row.isGroupHeader === true;
  }
}
