import { AfterViewInit, ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { appModuleAnimation } from "../../shared/animations/routerTransition";
import { DanceTypeCEComponent } from "../danceType/danceTypeCE.component";
import { AppComponentBase } from '../../shared/app-component-base';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-danceType',
    templateUrl: './danceType.component.html',
    styleUrls: ['./danceType.component.css'],
    animations: [appModuleAnimation()]
})

export class DanceTypeComponent extends AppComponentBase implements OnInit, AfterViewInit {
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
    displayedColumns = ['title', 'actions'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    filter: string;
    searchIcon: string;
    clearIconColor: string;

    isLoadingResults: boolean;

    order: Sort;

    constructor(private appBaseService: AppCrudBaseService, public dialog: MatDialog, injector: Injector, private cd: ChangeDetectorRef) {
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
        let dialogRef = this.dialog.open(DanceTypeCEComponent, config);
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
        let dialogRef = this.dialog.open(DanceTypeCEComponent, config);
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
                    this.appBaseService.delete("DanceType", entry)
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
        
        this.isLoadingResults = true;

        if (this.filter == "") {
            this.searchIcon = "search";
        }
        else {
            this.searchIcon = "clear";
        }

        this.appBaseService.list('DanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
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

        if (this.filter == "") {
            this.searchIcon = "search";
        }
        else {
            this.searchIcon = "clear";
        }
        this.appBaseService.list('DanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
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

}

