import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { appModuleAnimation } from "../../shared/animations/routerTransition";
import { FloorDanceTypeCEComponent } from "../floorDanceType/floorDanceTypeCE.component";
import { AppComponentBase } from '../../shared/app-component-base';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-accounting',
    templateUrl: './accounting.component.html',
    styleUrls: ['./accounting.component.css'],
    animations: [appModuleAnimation()]
})

export class AccountingComponent extends AppComponentBase implements OnInit, AfterViewInit {
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
    displayedColumns = ['typeBusinessElementMainBusinessElementName','typeBusinessElementName', 'count', 'total', 'cash', 'credit', 'shiftTitle', 'date', 'actions'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    filter: string;
    searchIcon: string;
    clearIconColor: string;

    isLoadingResults: boolean;

    order: Sort;
    today: number = Date.now();  
    //@Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
    filterDate: any
    dateWeek = new FormControl('');
    
    constructor(private appBaseService: AppCrudBaseService, public dialog: MatDialog, injector: Injector, private cd: ChangeDetectorRef, public datepipe: DatePipe) {
        super(injector);
        this.isLoadingResults = true;
    }

    ngOnInit() {

        this.order = { active: "", direction: "" };

        this.filter = "";
        this.searchIcon = "search";
        this.clearIconColor = "";
        this.loadData();
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    sortData(sort: Sort) {
        this.order.active = sort.active;
        this.order.direction = sort.direction;
        this.loadData();
    }


    openCreateDialog(): void {
        let config: MatDialogConfig = {
            disableClose: false,
            width: '992px',
            height: '',
            position: {
                top: '',
                bottom: '',
                left: '',
                right: ''
            },
            data: { entity: null, }
        };
        let dialogRef = this.dialog.open(FloorDanceTypeCEComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }

    openEditDialog(entry): void {
        let config: MatDialogConfig = {
            disableClose: false,
            width: '992px',
            height: '',
            position: {
                top: '',
                bottom: '',
                left: '',
                right: ''
            },
            data: { entity: entry }
        };
        let dialogRef = this.dialog.open(FloorDanceTypeCEComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadData();
            }
        });
    }


    onDeleteClick(entry): void {
        abp.message.confirm("Are you sure you want to delete this information?.",
            "Information",
            (result: boolean) => {
                if (result) {
                    this.appBaseService.delete("AccountingPerShift", entry)
                        .subscribe(response => {
                            if (response.success) {
                                abp.notify.info("The element was successfully removed");
                                this.loadData();
                            }
                        }, (error: HttpErrorResponse) => {
                            let errorMessage = '';
        
                            if (error.error instanceof ErrorEvent) {
                                // client-side error
                                errorMessage = `Error: ${error.error.message}`;
                            } else {
                                // server-side error
                                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                            }
                            abp.notify.error(this.appBaseService.errorMessage(error))
                            console.error(errorMessage);
                        })
                }
            }
        );
    }

    loadData() {
        this.dateWeek.setValue("")
        this.isLoadingResults = true;

        if (this.filter == "") {
            this.searchIcon = "search";
        }
        else {
            this.searchIcon = "clear";
        }

        this.appBaseService.list('AccountingPerShift', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.dataSource = new MatTableDataSource<any>(response.result.items);
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = response.result.totalCount;
                }

                this.isLoadingResults = false;
            },(error: HttpErrorResponse) => {
                this.isLoadingResults = false
                let errorMessage = '';

                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                abp.notify.error(this.appBaseService.errorMessage(error))
                console.error(errorMessage);
            });
    }

    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.loadData();
    }

    loadSearch() {
        this.dateWeek.setValue("")
        if (this.filter == "") {
            this.searchIcon = "search";
        }
        else {
            this.searchIcon = "clear";
        }
        this.appBaseService.list('AccountingPerShift', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.dataSource = new MatTableDataSource<any>(response.result.items);
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = response.result.totalCount;
                }

                this.isLoadingResults = false;
            },(error: HttpErrorResponse) => {
                this.isLoadingResults = false
                let errorMessage = '';

                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                abp.notify.error(this.appBaseService.errorMessage(error))
                console.error(errorMessage);
            });
    }

    loadFilter() {

        this.appBaseService.listFilter('AccountingPerShift', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.filterDate)
            .subscribe(response => {
                if (response.result) {
                    this.dataSource = new MatTableDataSource<any>(response.result.items);
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = response.result.totalCount;
                }

                this.isLoadingResults = false;
            },(error: HttpErrorResponse) => {
                this.isLoadingResults = false
                let errorMessage = '';

                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                abp.notify.error(this.appBaseService.errorMessage(error))
                console.error(errorMessage);
            });
    }

    clearFilter() {
        this.filter = "";
        this.loadSearch();
    }

    updateIconColor() {
        this.clearIconColor = this.clearIconColor == "" ? "primary" : "";
    }

    onDateChange(event): void {
        const m: Moment = event.value;
        if (m) {
            var date = new Date(event.value)
            this.filterDate = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
            this.loadFilter()
        }
    }

    refresh() {
        this.dateWeek.setValue("")
        this.loadData()
    }
    
}

