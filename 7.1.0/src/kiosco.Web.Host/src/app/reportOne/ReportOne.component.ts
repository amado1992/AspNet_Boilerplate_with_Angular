import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { appModuleAnimation } from "../../shared/animations/routerTransition";
import { ActivityTodayCEComponent } from "../activityToday/activityTodayCE.component";
import { AppComponentBase } from '../../shared/app-component-base';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report-one',
    templateUrl: './reportOne.component.html',
    styleUrls: ['./reportOne.component.css'],
    animations: [appModuleAnimation()]
})

export class ReportOneComponent extends AppComponentBase implements OnInit, AfterViewInit {
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
    displayedColumns = ['entertainerFirstName', 'entertainerStageName', 'entertainerMobilePhone', 'entertainerPermitExpires', 'entertainerContractExpires', 'isActive'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    filter: string;
    searchIcon: string;
    clearIconColor: string;

    isLoadingResults: boolean;

    order: Sort;
    entertainersActiveResuts: any[] = []

    whatShitf: boolean = true
    public getScreenWidth: any;
    public getScreenHeight: any;
    infoReport: boolean = false
    dateNow = Date.now()
    isShowTotal: boolean = true

    constructor(private appBaseService: AppCrudBaseService, public dialog: MatDialog, injector: Injector, private cd: ChangeDetectorRef, public datepipe: DatePipe) {
        super(injector);
        this.isLoadingResults = true;
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
    }

    ngOnInit() {
        localStorage.removeItem("refreshReport")
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;

        this.order = { active: "", direction: "" };

        this.filter = "";
        this.searchIcon = "search";
        this.clearIconColor = "";
        this.loadData();
        this.entertainersActive()
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
        let dialogRef = this.dialog.open(ActivityTodayCEComponent, config);
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
        let dialogRef = this.dialog.open(ActivityTodayCEComponent, config);
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
                    this.appBaseService.delete("ActivityToday", entry)
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

        this.appBaseService.getActivityToday('ActivityToday', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.dataSource = new MatTableDataSource<any>(response.result.items);
                    if (this.paginator != undefined){
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = response.result.totalCount;
                    }
                }

                this.isLoadingResults = false;
            }, (error: HttpErrorResponse) => {
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

    entertainersActive() {

        this.appBaseService.getIsActiveToday('ActivityToday', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.entertainersActiveResuts = response.result.items
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
        this.appBaseService.getActivityToday('ActivityToday', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.dataSource = new MatTableDataSource<any>(response.result.items);
                    this.paginator.pageIndex = this.currentPage;
                    this.paginator.length = response.result.totalCount;
                }

                this.isLoadingResults = false;
            }, (error: HttpErrorResponse) => {
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

    onActiveSlide(entityDto): void {
        this.appBaseService.update('ActivityToday', entityDto)
            .subscribe(response => {
                abp.notify.info("Action successfully completed")
                this.loadData()
                this.entertainersActive()
            });
    }

    changeInfo(value) {
        if (value) {
            this.entertainersActive()
            this.loadData()
            var refresh = JSON.parse(localStorage.getItem("refreshReport"))
            
            if (refresh != null) {
                localStorage.setItem("refreshReport", JSON.stringify(!refresh))
                this.infoReport = JSON.parse(localStorage.getItem("refreshReport"))

                
            } else {
                this.infoReport = true
            }
        }
    }
    day() {
        this.whatShitf = !this.whatShitf
    }

    night() {
        this.whatShitf = !this.whatShitf
    }

    getDiffDay(value) {
        var today = new Date(this.dateNow)
        var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
        var date = new Date(latestDate)

        var _value = new Date(value);
        _value = new Date(this.datepipe.transform(_value, 'yyyy-MM-dd HH:mm:ss'))

        var diff = this._getDiffDay(_value, date)

        return diff;
    }

    _getDiffDay(endDate, startDate) {

        const msInHour = 60 * 60000 * 24;

        return Math.round(
            Math.abs(endDate - startDate) / msInHour
        );

       /* var diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        return days*/
    }

    showTotal(value){
    this.isShowTotal = value
    console.log("PADREE", this.isShowTotal)
    }

}

