import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableWrapperComponent } from './mat-table-wrapper.component';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('MatTableWrapperComponent', () => {
  let component: MatTableWrapperComponent;
  let fixture: ComponentFixture<MatTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatChipsModule,
        DragDropModule,
        MatIconModule,
        MatCheckboxModule,
        NoopAnimationsModule
      ],
      declarations: [MatTableWrapperComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the data source and available columns', () => {
    expect(component.dataSource.data.length).toBe(4);
    expect(component.availableColumns).toEqual(['select', 'id', 'name', 'status', 'priority']);
  });

  it('should select all rows when master toggle is clicked', () => {
    component.masterToggle();
    expect(component.selection.selected.length).toBe(4);

    component.masterToggle();
    expect(component.selection.selected.length).toBe(0);
  });

  it('should correctly update the grouped data', () => {
    component.groupedColumns = ['status'];
    component.updateGrouping();
    expect(component.dataSource.data.length).toBeGreaterThan(4);
  });

  it('should remove a column from grouping', () => {
    component.groupedColumns = ['status'];
    component.updateGrouping();

    component.removeGrouping('status');
    expect(component.groupedColumns).not.toContain('status');
    expect(component.availableColumns).toContain('status');
  });

  it('should handle column drag and drop for grouping', () => {
    const previousColumns = [...component.availableColumns];
    component.onColumnDrop({
      previousContainer: { id: 'availableList', data: previousColumns } as any,
      container: { id: 'groupList', data: component.groupedColumns } as any,
      previousIndex: 0,
      currentIndex: 0,
      item: {} as any,
      isPointerOverContainer: false,
      distance: {
        x: 0,
        y: 0
      },
      dropPoint: {
        x: 0,
        y: 0
      },
      event: new MouseEvent('mouseup') 
    });

    expect(component.groupedColumns.length).toBe(1);
    expect(component.availableColumns.length).toBe(previousColumns.length - 1);
  });

  it('should handle row drag and drop', () => {
    const previousData = [...component.dataSource.data];
    component.onRowDrop({
      previousContainer: { data: previousData } as any,
      container: { data: component.dataSource.data } as any,
      previousIndex: 0,
      currentIndex: 1,
      item: {} as any,
      isPointerOverContainer: false,
      distance: {
        x: 0,
        y: 0
      },
      dropPoint: {
        x: 0,
        y: 0
      },
      event: new MouseEvent('mouseup') 
    });

    expect(component.dataSource.data[0]).not.toEqual(previousData[0]);
  });

  it('should identify a group header row', () => {
    const groupHeaderRow = { isGroupHeader: true };
    const normalRow = { isGroupHeader: false };

    expect(component.isGroupHeader(groupHeaderRow)).toBeTrue();
    expect(component.isGroupHeader(normalRow)).toBeFalse();
  });

  it('should generate group data correctly', () => {
    const groupedData = component.groupData(component.originalData);
    expect(groupedData.size).toBeGreaterThan(0); 
  });

  it('should update grouping correctly when no grouped columns exist', () => {
    component.groupedColumns = [];
    component.updateGrouping();

    expect(component.dataSource.data).toEqual(component.originalData);
  });

  it('should handle empty drag between column containers', () => {
    const initialAvailable = [...component.availableColumns];
    const initialGrouped = [...component.groupedColumns];

    component.onColumnDrop({
      previousContainer: { id: 'groupList', data: initialGrouped } as any,
      container: { id: 'availableList', data: initialAvailable } as any,
      previousIndex: 0,
      currentIndex: 0,
      item: {} as any,
      isPointerOverContainer: false,
      distance: {
        x: 0,
        y: 0
      },
      dropPoint: {
        x: 0,
        y: 0
      },
      event: new MouseEvent('mouseup') 
    });

    expect(component.groupedColumns).toEqual(initialGrouped);
    expect(component.availableColumns).toEqual(initialAvailable);
  });

  it('should render the table with correct rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('mat-row'));
    expect(rows.length).toBe(component.dataSource.data.length);
  });

  it('should render checkboxes for selection', () => {
    const checkboxes = fixture.debugElement.queryAll(By.css('mat-checkbox'));
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});
