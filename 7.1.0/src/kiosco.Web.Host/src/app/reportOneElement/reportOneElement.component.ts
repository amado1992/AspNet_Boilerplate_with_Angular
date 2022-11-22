import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, EventEmitter, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { appModuleAnimation } from "../../shared/animations/routerTransition";
import { ActivityTodayCEComponent } from "../activityToday/activityTodayCE.component";
import { AppComponentBase } from '../../shared/app-component-base';
import { HttpErrorResponse } from '@angular/common/http';
import { FloorDanceTypeCEComponent } from '@app/floorDanceType/floorDanceTypeCE.component';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FloorDanceTypeDto } from '@shared/entities/floorDanceType';
import { DatePipe } from '@angular/common';
import { parse } from 'path';
import { TotalComponent } from '@app/total/total.component';
import { ReportComponent } from '@app/report/report.component';
import { result } from 'lodash-es';
import { BaseFeeDto } from '@shared/entities/baseFee'

@Component({
    selector: 'app-reportOne-element',
    templateUrl: './reportOneElement.component.html',
    styleUrls: ['./reportOneElement.component.css'],
    animations: [appModuleAnimation()]
})

export class ReportOneElementComponent extends AppComponentBase implements OnInit, AfterViewInit, DoCheck {
    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    baseFee = new BaseFeeDto()

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>()
    displayedColumns = ['entertainerFirstName', 'entertainerLastName', 'entertainerMobilePhone', 'entertainerPermitExpires', 'entertainerContractExpires',  'isActive'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    whatShitf: boolean = true
    filter: string;
    searchIcon: string;
    clearIconColor: string;

    isLoadingResults: boolean;

    order: Sort;
    entertainerDancesResuts: any[] = []
    quotaResut: any
    quotaSumaryResut: any
    baseDancesResults: any
    scheduleDanceResut: any
    schedulesResults: any[] = []   
    schedulesResultsNight: any[] = [] 
    //temporizador
    interval;
    isPause: boolean = false;

    miliSecond: number = 0;
    second: number = 0;
    minute: number = 1;

    miliSecondPlus: number = 60;
    secondPlus: number = 60;
    minutePlus: number = 0;
    //fin temporizador
    
    @Output() changeInfo: EventEmitter<any> = new EventEmitter();
    @Output() showTotal: EventEmitter<any> = new EventEmitter();
    @Input() indice: any;
    @Input() element: any;

    index:any = 0
    shiftsResults: any[] = []
    baseList = [{ title: "Before 1200", value: 0,  id: 1 },
    { title: "1200-1900", value: 15, id: 2 },
    { title: "After 1900", value: 25, id: 3 }]

    schedule: any
    scheduleNight = [{ title: "1900 to 2000", id: 1, start: "19:00", end: "19:59" },
    { title: "2000 to 2100", id: 2, start: "20:00", end: "20:59" },
    { title: "2100 to 2200", id: 3, start: "21:00", end: "21:59" },
    { title: "2200 to 2300", id: 4, start: "22:00", end: "22:59" },
    { title: "2300 to 2400", id: 5, start: "23:00", end: "23:59" },
    { title: "2400 to 0100", id: 6, start: "00:00", end: "00:59" },
    { title: "0100 to 0200", id: 7, start: "01:00", end: "01:59" }]

    scheduleDay = [{ title: "1200 to 1300", id: 1, start: "12:00", end: "12:59" },
    { title: "1300 to 1400", id: 2, start: "13:00", end: "13:59" },
    { title: "1400 to 1500", id: 3, start: "14:00", end: "14:59" },
    { title: "1500 to 1600", id: 4, start: "15:00", end: "15:59" },
    { title: "1600 to 1700", id: 5, start: "16:00", end: "16:59" },
    { title: "1700 to 1800", id: 6, start: "17:00", end: "17:59" },
    { title: "1800 to 1900", id: 7, start: "18:00", end: "18:59" }]

    viewList = [{ title: "All", id: 1},
    { title: "In private daces", id: 2 }]

    showingDues  = [{ title: "Showing dues for all entertainers", id: 1},
    { title: "Showing only entertainers whith outstanding", id: 2 }]

    viewList1 = [{ title: "www", id: 1},
    { title: "In private daces", name: "sss"}]

    hideTotals = [{ title: "Show total", id: 1},
    { title: "Hide total", id: 2 }]

    shiftId = new FormControl(0);
    baseId = new FormControl(1);
    viewId = new FormControl(1)
    totalId = new FormControl(1);
    showingDueId = new FormControl(1)
    whatShowingDue: boolean = true
    endDanceId: any = 0
    objFloorDance: any
    entityDto: FloorDanceTypeDto
    danceTypeId: any
    colorGreen = " #a2cde5"
    today: number = Date.now();  
    form = this.fb.group({

        activityTodayId: ['',],
        danceTypeId: [''],
        keyId: ['',],
        shiftId: [''],
        start: ['',],
        end: [''],
        count: [''],
        background: ['']

    });
    danceTypesResults: any[] = []
    porcent: any
    notifyInfo: boolean = false
    dateNow = Date.now()
    _selectBaseFee: any
    floorFee: any = 0
    idNight: any = 0
    idDay: any = 0

    constructor(private appBaseService: AppCrudBaseService, public dialog: MatDialog, injector: Injector, private cd: ChangeDetectorRef, private fb: FormBuilder, public datepipe: DatePipe) {
        super(injector);
        this.isLoadingResults = true;
        this.entityDto = new FloorDanceTypeDto()
    }

    ngOnInit() {
        
        var shifId = localStorage.getItem("shiftId")
        if (shifId) {
            this.shiftId.setValue(JSON.parse(shifId))
        }

        var totalId = localStorage.getItem("totalId")
        if (totalId) {
            this.totalId.setValue(JSON.parse(totalId))
        }

        if (this.indice) {
            if (this.indice >= 0) {
                this.index = this.indice;
            }
        }

        this.order = { active: "", direction: "" };

        this.filter = "";
        this.searchIcon = "search";
        this.clearIconColor = "";
        //this.entertainerDances()
        this.shifts()
        this.danceTypes()
        //this.quotaV2()
        //this.loadDanceSchedule()
    }
    ngDoCheck() {
        
        if (this.notifyInfo){
            this.notifyInfo = false  
        }
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

    entertainerDances() {

        if (this.element != undefined) {
            this.appBaseService.getFloorDanceIdReport('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
                .subscribe(response => {
                    if (response.result) {
                        this.entertainerDancesResuts = response.result.items
                        console.log("Bien test worker....", this.entertainerDancesResuts)
                        this.baseDances()
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
    }

    quota() {

        if (this.element != undefined) {
            this.appBaseService.getQuotaId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
                .subscribe(response => {
                    if (response.result) {
                        this.quotaResut = response.result
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
    }

    quotaSumary() {

        if (this.element != undefined) {
            this.appBaseService.getQuotaSumaryId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
                .subscribe(response => {
                    if (response.result) {
                        this.quotaSumaryResut = response.result
                        this.changeInfo.emit(true)
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

    onActiveSlide(entityDto): void {
        this.appBaseService.update('ActivityToday', entityDto)
            .subscribe(response => {
                    abp.notify.info("Action successfully completed")
                    this.loadData()
            });
    }

    day(){
        this.whatShitf = !this.whatShitf
    }

    night(){
        this.whatShitf = !this.whatShitf
    }

    openDialog(): void {
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
                var id = localStorage.getItem("activityTodayId")
                
                this.changeInfo.emit(true)
                this.entertainerDancesLoad(id)
            }
        });
    }

    openDialogTotal(): void {
        this.appBaseService.lanzamiento
            .subscribe(lanzamiento => {
                if (lanzamiento != "NextOne") {
                    
                    this.notifyInfo = true
                    this.changeInfo.emit(true)
                    this.appBaseService.addValue("NextOne");
                }
            });
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
            data: { entity: this.element }
        };
        let dialogRef = this.dialog.open(TotalComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var id = localStorage.getItem("activityTodayId")
                
                this.changeInfo.emit(true)
                this.entertainerDancesLoad(id)
            }
        });
    }

    openDialogReport(): void {
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
            data: { entity: this.element }
        };
        let dialogRef = this.dialog.open(ReportComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
            }
        });
    }
    entertainerDancesLoad(id) {

        ///if (this.element != undefined) {
            this.appBaseService.getFloorDanceId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, id, this.shiftId.value)
                .subscribe(response => {
                    if (response.result) {
                        this.entertainerDancesResuts = response.result.items
                        console.log("Bien ok worker....", this.entertainerDancesResuts)
                        this.baseDances()
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


       // }
    }

    shifts() {
        this.appBaseService.list('Shift', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.shiftsResults = response.result.items;
                    var today = new Date(this.dateNow)
                    var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
                    var date = new Date(latestDate)

                    var shifId = localStorage.getItem("shiftId")

                    /*if (shifId) {
                        
                        var entry = this.shiftsResults.find(val => val.id == JSON.parse(shifId))
                        
                        var today = new Date(this.dateNow)
                        var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
                        var date = new Date(latestDate)

                        if (entry != undefined) {
                            var fromTime = new Date(entry.fromTime)
                            var toTime = new Date(entry.toTime)

                            if ((fromTime.getHours() >= 12 && fromTime.getHours() <= 19)
                                && (toTime.getHours() >= 12 && toTime.getHours() <= 19)) {
                              this.schedule = this.scheduleDay
                              this.floorFee = 15
                            }

                            if ((fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                    this.schedule = this.scheduleNight
                                    this.floorFee = 25
                            }

                        }
                    } else {*/

                        for (let entry of this.shiftsResults) {

                            var fromTime = new Date(entry.fromTime)
                            var toTime = new Date(entry.toTime)

                            if ((fromTime.getHours() >= 12 && fromTime.getHours() <= 19)
                                && (toTime.getHours() >= 12 && toTime.getHours() <= 19)) {
                                this.shiftId.setValue(entry.id)
                                this.schedule = this.scheduleDay
                                this.idDay = entry.id
                                this.loadDanceSchedule()
                            }

                            if ((fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                this.shiftId.setValue(entry.id)
                                this.schedule = this.scheduleNight
                                this.idNight = entry.id
                                this.scheduleDanceNight()
                            }

                        }
                    //}

                    this.entertainerDances()
                    this.quotaV2()

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

    baseDances() {
        this.appBaseService.list('DanceBase', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.baseDancesResults = response.result.items;
                    var result
                    
                    if (this.entertainerDancesResuts.length > 0) {
                        for (var i = 0; i < this.baseDancesResults.length; i++) {
                          result = this.entertainerDancesResuts.find(val => val.codeDance == this.baseDancesResults[i].codeDance)
                          
                            if (result != undefined) {
                                this.baseDancesResults.splice(i, 1, result)
                            }
                         }
                    }
                    
                    this.entertainerDancesResuts = this.baseDancesResults.slice()
                    
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

    doSomething(){
        
    }
    showOnly(){
        this.whatShowingDue = !this.whatShowingDue
    }
    showAll(){
        this.whatShowingDue = !this.whatShowingDue
    }

    counter(i: number) {
        return new Array(i);
    }

    public startCronometroTwo(value?) {
        
        this.objFloorDance = value
        if (!this.isPause) {
            this.isPause = true;
            this.interval = setInterval(() => {
                if (++this.miliSecond >= this.miliSecondPlus) {
                    this.miliSecond = 0

                    if (++this.second >= this.secondPlus) {
                        this.miliSecond = 0
                        this.second = 0

                        if (--this.minute <= this.minutePlus) {
                            this.miliSecond = 0
                            this.second = 0
                            this.minute = 0
                            this.pauseCronometro()
                            this.endDanceId = this.endDance()
                            this.updateRow()
                        }
                    }
                }
            }, 1)
        }
    }
  
    public startCronometro(value?, start?, timeDance?) {

        this.objFloorDance = value
        if (!this.isPause) {
            this.isPause = true;
            this.interval = setInterval(() => {
                var now = Date.now()
                var today = new Date(now)
                start = new Date(start)
                
                var _second = this.getSecondDiff(start, today)
                var _minute = this.getMinDiff(start, today)

                this.second = timeDance * 60 - _second
                this.minute = timeDance - _minute

                var _porcent = this.minute * 100 / timeDance
                this.porcent = _porcent

                if (this.minute <= 0) {
                    this.second = 0
                    this.minute = 0

                    this.pauseCronometro()
                    this.endDanceId = this.endDance()
                    this.updateRow()
                }
            }, 1)
        }
    }
  
  
    resetCronometro() {
      
    if (!this.isPause){
      this.miliSecond = 0
      this.second = 0
      this.minute = 1
      }
    }
  
    pauseCronometro() {
      this.isPause = true;
      clearInterval(this.interval);
    }

    stopCronometro() {
        this.second = 0
        this.minute = 0
        this.porcent = 0

        this.pauseCronometro()
        this.endDanceId = this.endDance()
        this.updateRow()
    }

    pauseCronometroTwo() {
        this.isPause = false;
        this.isPause = true;
        clearInterval(this.interval);
      }
    endDance() {
        
      return this.element != undefined ? this.element.id : 0;
    }
    
    updateRow(): void {      
        this.appBaseService.updateRow('FloorDanceType', this.objFloorDance.id)
            .subscribe(response => {

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

    initData(minute){
        //temporizador   
    this.minute = minute;
    //fin temporizador
    }

    getMinDiff(startDate, endDate) {
        const msInMinute = 60 * 1000;
      
        return Math.round(
          Math.abs(endDate - startDate) / msInMinute
        );
      }

      getSecondDiff(startDate, endDate) {
        const msInSecond = 1000;
      
        return Math.round(
          Math.abs(endDate - startDate) / msInSecond
        );
      }

      getDance(obj){
        
        var objVal = this.danceTypesResults.find(val => val.codeDance == obj.codeDance)
        
        this.danceTypeId = objVal.id
        if (objVal.codeDance == "Expose"){
            this.form.get("background").setValue("#8eaac5")
            this.form.get("count").setValue(1)   
        }
        if (objVal.codeDance == "VIPMedium"){
            this.form.get("background").setValue("#e2b280")
            this.form.get("count").setValue(1) 
        }

        if (objVal.codeDance == "VIPOne"){
            this.form.get("background").setValue("#2ecc71")
            this.form.get("count").setValue(1) 
        }
        
        if (objVal.codeDance == "VIPFive"){
            this.form.get("background").setValue("#b4a4c3") 
            this.form.get("count").setValue(5)
        }

        this.save()
      }

      getDanceVIPFive(obj){
        var objVal = this.danceTypesResults.find(val => val.codeDance == obj.codeDance)
        this.danceTypeId = objVal.id
        
        if (objVal.codeDance == "VIPFive"){
            this.form.get("background").setValue("#b4a4c3") 
            this.form.get("count").setValue(1)
        }

        this.save()
      }
    updateDto() {

        var start = Date.now()
        var today = new Date(start)
        let latest_date = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');

        this.form.get("start").setValue(latest_date)
        this.form.get("activityTodayId").setValue(this.element.id)
        this.form.get("danceTypeId").setValue(this.danceTypeId)
        this.form.get("shiftId").setValue(this.shiftId.value)
        
        this.entityDto.baseFeeId = this.baseId.value
        var obj = this.baseList.find(val => val.id == this.baseId.value)
        if (obj != undefined) {
            this.entityDto.baseFee = obj.value
        }

        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);

        localStorage.setItem("activityTodayId", this.entityDto.activityTodayId)
    }
      save(): void {
        this.updateDto()
          var id
          if (this.shiftId.value != 0) {
              if (this.shiftsResults.length > 0) {
                  id = this.shiftsResults.find(val => val.id == this.shiftId.value)
                  
              }
              if (id == undefined) {
                  localStorage.removeItem("shiftId")
                  this.shiftId.setValue(0)
              }
          }
        if(this.shiftId.value != 0){
            this.appBaseService.create('FloorDanceType', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    
                    /*this.entertainerDances()
                    this.quotaV2()
                    this.loadDanceSchedule()*/

                    this.changeInfo.emit(true)
                    abp.notify.info("New element successfully created.")
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
            }else {
                abp.notify.info("Please select a shift")
            }
    }

    danceTypes() {
        this.appBaseService.list('DanceType', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.danceTypesResults = response.result.items;
                    //this.loadDanceSchedule()
                    
                }
            },(error: HttpErrorResponse) => {
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

    selectShift(event: Event) {
        
        var selected = (event.target as HTMLSelectElement).value;
        localStorage.setItem("shiftId", JSON.stringify(selected)) 
        
        this.changeInfo.emit(true)
      }

      selectTotal(event: Event) {
        
        var selected = (event.target as HTMLSelectElement).value;
        localStorage.setItem("totalId", JSON.stringify(selected)) 
        
        if(JSON.parse(selected) == 2){           
        this.showTotal.emit(false)
        }else {
            this.showTotal.emit(true)
        }
      }

    onDelete(entry): void {
        
        /*if (entry.codeDance == "VIPFive" && entry.count == 5) {

            this.appBaseService.get("FloorDanceType", entry.id)
                .subscribe(response => {
                    Object.assign(this.entityDto, response.result)
                    this.entityDto.count = this.entityDto.count - 5
                    this.entityDto.customerDanceFees = this.entityDto.customerDanceFees - 100

                    abp.message.confirm("Are you sure you want to subtracting this information?.",
                        "Information",
                        (result: boolean) => {
                            if (result) {
                                this.appBaseService.update("FloorDanceType", this.entityDto)
                                    .subscribe(response => {
                                        if (this.element != undefined) {
                                            
                                            this.appBaseService.getFloorDanceId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
                                                .subscribe(response => {

                                                    if (response.result) {
                                                        console.log("TESTOBJ", response.result)
                                                        this.entertainerDancesResuts = response.result.items
                                                        var obj = this.entertainerDancesResuts.find(val => val.codeDance == entry.codeDance)

                                                        if (obj.count == 0) {
                                                            this.appBaseService.delete("FloorDanceType", entry)
                                                                .subscribe(response => {
                                                                    if (response.success) {
                                                                        abp.notify.info("The element was successfully subtracting");
                                                                        this.changeInfo.emit(true)
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
                                                        } else {
                                                            abp.notify.info("The element was successfully subtracting");
                                                            this.changeInfo.emit(true)
                                                        }
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
        } else {*/

            abp.message.confirm("Are you sure you want to subtracting this information?.",
                "Information",
                (result: boolean) => {
                    if (result) {
                        this.appBaseService.delete("FloorDanceType", entry)
                            .subscribe(response => {
                                if (response.success) {
                                    abp.notify.info("The element was successfully subtracting");
                                    /*this.entertainerDances()
                                    this.quotaV2()
                                    this.loadDanceSchedule()*/
                                    this.changeInfo.emit(true)
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
   // }

   timeToDate(time) {
    var today = new Date();
    time = new Date('1970-01-01' + ' ' + time + 'Z').getTime();
    var date = today.setHours(0, 0, 0, 0);
    var DateTime = new Date(date + time);
    return DateTime;
}

quotaV2() {
    console.log("OHH TURNO ", this.shiftId.value)
    if(this.element != undefined){
        this.appBaseService.getSumQuotaReport('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {
                    this.quotaResut = response.result
                    if (this.quotaResut.baseFeeId == null) {
                        this.baseId.setValue(1)
                    } else { 
                        this.baseId.setValue(this.quotaResut.baseFeeId)
                    }
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

        }/*else {
                abp.notify.info("Please select a shift")
            }*/
}

quotaSumaryV2() {

    if(this.shiftId.value != 0){
        this.appBaseService.getQuotaSumaryId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {
                    this.quotaSumaryResut = response.result
                    this.changeInfo.emit(true)
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
        }else {
            abp.notify.info("Please select a shift")
        }
}

scheduleObj(i){
    var val
    if (this.schedule != undefined){
        val = this.scheduleDay[i]
    }
    return val
}

scheduleObjNight(i){
    var val
    if (this.schedule != undefined){
        val = this.scheduleNight[i]
    }
    return val
}

scheduleDance(/*danceId?, start?, end?, scheduleId?*/) {
    
    if (this.element != undefined) {
        //this.appBaseService.getSheduleDanceId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.shiftId.value, danceId, start, end, scheduleId)
        this.appBaseService.getSheduleDanceId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.idDay)    
        .subscribe(response => {
                if (response.result) {
                    //this.scheduleDanceResut = response.result
                    this.schedulesResults = response.result
                    console.log("RESULT SCHEDULE ", this.schedulesResults)
                    //this.schedulesResults.push(this.scheduleDanceResut)
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
}


scheduleDanceNight() {
    
    if (this.element != undefined) {
        this.appBaseService.getSheduleDanceId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.element.id, this.idNight)    
        .subscribe(response => {
                if (response.result) {
                    this.schedulesResultsNight = response.result
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
}


    loadDanceSchedule() {
        this.scheduleDance()
        /*for (let entry of this.schedule) {
            
            for (let entryDance of this.danceTypesResults) {
                console.log("My test wwww eee... ", this.danceTypesResults)
                this.scheduleDance(entryDance.id, entry.start, entry.end, entry.id)
            }
        }*/
    }

    countDanceObj(posSchedule, dance){
        var result = 0
        var id
        if (this.scheduleDay != undefined) {
            id = this.scheduleDay[posSchedule].id
        }
        var obj = this.schedulesResults.find(val => val.scheduleId == id && dance.codeDance == val.codeDance && this.element.id == val.activityTodayId)
        
        if (obj != undefined){
         result = obj.count
        }
        return result
    }

    countDanceObjNight(posSchedule, dance){
        var result = 0
        var id
        if (this.scheduleNight != undefined) {
            id = this.scheduleDay[posSchedule].id
        }
        var obj = this.schedulesResultsNight.find(val => val.scheduleId == id && dance.codeDance == val.codeDance && this.element.id == val.activityTodayId)
        
        if (obj != undefined){
         result = obj.count
        }
        return result
    }

    getHour(posSchedule) {
        var today = new Date(this.dateNow)
        var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
        var date = new Date(latestDate)
        var obj 
        if (this.schedule != undefined) {
        obj = this.schedule[posSchedule]

        var isCurrentHour = false
        var timeStringStart = obj.start;
        var timeStringEnd = obj.end;
        var start = new Date('1970-01-01T' + timeStringStart);
        var end = new Date('1970-01-01T' + timeStringEnd);
        
        start = new Date(this.datepipe.transform(start, 'yyyy-MM-dd HH:mm:ss'))
        end = new Date(this.datepipe.transform(end, 'yyyy-MM-dd HH:mm:ss'))
        
        if (date.getHours() >= start.getHours() && date.getHours() <= end.getHours()){
            isCurrentHour = true
        }

        if (date.getHours() >= 2 && date.getHours() < 12){
            if (start.getHours() > 0 && end.getHours() < 2){
                isCurrentHour = true 
            }
        }
    }
     return isCurrentHour
    }

    parseTime( t ) {
        var d = new Date();
        var time = t.match( /(\d+)(?::(\d\d))?\s*(p?)/ );
        d.setHours( parseInt( time[1]) + (time[3] ? 12 : 0) );
        d.setMinutes( parseInt( time[2]) || 0 );
    }
   
    getDiffDay(value) {
        var today = new Date(this.dateNow)
        var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
        var date = new Date(latestDate) 

        var _value = new Date(value);      
        _value = new Date(this.datepipe.transform(_value, 'yyyy-MM-dd HH:mm:ss'))

        var diff = date.getDay() - _value.getDay()
        return diff;
    }

    selectBaseFee(event: Event) {
        this._selectBaseFee = (event.target as HTMLSelectElement).value;

        this.entityDto.baseFeeId = this._selectBaseFee
        var obj = this.baseList.find(val => val.id == this.entityDto.baseFeeId)
        if (obj != undefined) {
            this.entityDto.baseFee = obj.value
        }

        this.baseFee.activityId = this.element.id
        this.baseFee.baseFee = this.entityDto.baseFee
        this.baseFee.baseFeeId = this.entityDto.baseFeeId
        this.baseFee.shiftId = this.shiftId.value
        
         this.appBaseService.postBaseFee('FloorDanceType', this.baseFee)    
         .subscribe(next => {
                 this.changeInfo.emit(next.result)
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

}

