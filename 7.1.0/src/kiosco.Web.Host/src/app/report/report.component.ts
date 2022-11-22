import { Component, HostListener, Inject, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { GroupDto } from '../../shared/entities/group';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})

export class ReportComponent extends AppComponentBase implements OnInit, OnChanges {
    entityDto: any
    isLoadingResults: boolean = false
    totalRows = 0;
    pageSize = 200000;
    currentPage = 0;
    order: any;
    filter: any;
    quotaSumaryResut: any[] = []
    danceTotalResuts: any[] = []
    shiftsResults: any[] = []
    danceSumTotalResuts: any[] = []
    totalResuts: any
    totalSumResuts: any
    shiftId: any
    danceTotalTwoResuts: any[] = []
    totalTwoResuts: any
    
    shiftTwo: any
    idShiftTwo: any
    shiftOne: any = 0
    idShiftOne: any = 0
    existShift: boolean = false
    form = this.fb.group({

        name: ['', Validators.required]

    });

    baseList = [{ title: "Before 1200", value: 0,  id: 1 },
    { title: "1200-1900", value: 15, id: 2 },
    { title: "After 1900", value: 25, id: 3 }]

    schedule: any
    scheduleNight = [{ title: "1900 to 2000", id: 1,start: "19:00", end: "19:59" },
    { title: "2000 to 2100", id: 2, start: "20:00", end: "20:59"},
    { title: "2100 to 2200", id: 3, start: "21:00", end: "21:59" },
    { title: "2200 to 2300", id: 4, start: "22:00", end: "22:59" },
    { title: "2300 to 2400", id: 5, start: "23:00", end: "23:59" },
    { title: "2400 to 0100", id: 6, start: "00:00", end: "00:59" },
    { title: "0100 to 0200", id: 7, start: "01:00", end: "01:59"}]

    scheduleDay = [{ title: "1200 to 1300", id: 1,start: "12:00", end: "12:59" },
    { title: "1300 to 1400", id: 2, start: "13:00", end: "13:59"},
    { title: "1400 to 1500", id: 3, start: "14:00", end: "14:59" },
    { title: "1500 to 1600", id: 4, start: "15:00", end: "15:59" },
    { title: "1600 to 1700", id: 5, start: "16:00", end: "16:59" },
    { title: "1700 to 1800", id: 6, start: "17:00", end: "17:59" },
    { title: "1800 to 1900", id: 7, start: "18:00", end: "18:59"}]

    schedulesResults: any[] = []
    schedulesResultsTwo: any[] = []
    dateNow = Date.now() 
    baseDancesResults: [] = []
    @Input() infoReport: any;
    public getScreenWidth: any;
    public getScreenHeight: any; 
    today: number = Date.now();  

    constructor(injector: Injector, /*public dialogRef: MatDialogRef<any>,*/
        /*@Inject(MAT_DIALOG_DATA) public data: any,*/ private appBaseService: AppCrudBaseService,
        private fb: FormBuilder, public datepipe: DatePipe) {
        super(injector);


        /*if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }*/
    }

    @HostListener('window:resize', ['$event'])
    onWindowResize() {
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
    }

    ngOnChanges(changes: SimpleChanges) {
        // changes.prop contains the old and the new value...
        console.log("Info report... ", changes.infoReport)
        
            var id = localStorage.getItem("shiftId")
            this.shiftId = JSON.parse(id)
            this.order = { active: "", direction: "" };

            this.filter = "";
            this.shifts()
            this.danceSumTotal()
            this.totalSum()
            this.baseDances()
            localStorage.setItem("refreshReport", JSON.stringify(this.infoReport))
    }

    ngOnInit(): void {
        this.getScreenWidth = window.innerWidth;
        this.getScreenHeight = window.innerHeight;
        
        var id = localStorage.getItem("shiftId")
        this.shiftId = JSON.parse(id)
        this.order = { active: "", direction: "" };

        this.filter = "";
        /*this.danceTotal()
        this.total()*/
        this.shifts()
        this.danceSumTotal()
        this.totalSum()
        //this.updateForm()
        this.baseDances()
        /*this.idShiftOne = 1
        this.schedulesDances()*/

    }

    get nameControl(): AbstractControl | null {
        return this.form.get('name');
    }

    cancel(): void {
        
        //this.dialogRef.close();
    }

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('Group', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("New element successfully created.")
                    //this.dialogRef.close(true)
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
        } else {
            this.appBaseService.update('Group', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("A new element has been successfully updated.")
                    //this.dialogRef.close(true)
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
    }

    updateForm() {
        this.form.patchValue({

            name: this.entityDto.name
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }

    danceTotal() {
        this.shiftId = this.idShiftOne
        //if (this.entityDto != undefined) {
            this.appBaseService.getDanceTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.shiftId)
                .subscribe(response => {
                    if (response.result) {
                        this.danceTotalResuts = response.result
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


        //}
    }

    total() {
        this.shiftId = this.idShiftOne
        //if (this.entityDto != undefined) {
            this.appBaseService.getTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.shiftId)
                .subscribe(response => {
                    if (response.result) {
                        this.totalResuts = response.result
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


        //}
    }

    danceTotalTwo() {
       // if (this.entityDto != undefined) {
            this.appBaseService.getDanceTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.idShiftTwo)
                .subscribe(response => {
                    if (response.result) {
                        this.danceTotalTwoResuts = response.result
                        console.log("RESULTADO...", this.danceTotalTwoResuts)
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


        //}
    }

    totalTwo() {

       // if (this.entityDto != undefined) {
            this.appBaseService.getTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.idShiftTwo)
                .subscribe(response => {
                    if (response.result) {
                        this.totalTwoResuts = response.result
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


        //}
    }
    danceSumTotal() {
        this.shiftId = this.idShiftOne
       // if (this.entityDto != undefined) {
            this.appBaseService.getDanceSumTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
                .subscribe(response => {
                    if (response.result) {
                        this.danceSumTotalResuts = response.result
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


        //}
    }

    totalSum() {
        this.shiftId = this.idShiftOne
        //if (this.entityDto != undefined) {
            this.appBaseService.getSumTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
                .subscribe(response => {
                    if (response.result) {
                        this.totalSumResuts = response.result
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


        //}
    }

    shifts() {
        this.existShift = false
        this.appBaseService.list('Shift', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order)
            .subscribe(response => {
                if (response.result) {
                    this.shiftsResults = response.result.items
                    this.existShift = true
                    /*if (this.shiftsResults.length > 0) {

                        this.shiftOne = this.shiftsResults[0].title
                        this.idShiftOne = this.shiftsResults[0].id
                        this.danceTotal()
                        this.total()
                        this.schedulesDances()
                    }
                    
                    if (this.shiftsResults.length > 1) {

                        this.shiftTwo = this.shiftsResults[1].title
                        this.idShiftTwo = this.shiftsResults[1].id
                        this.danceTotalTwo()
                        this.totalTwo()
                        this.schedulesDancesTwo()
                    }*/ 

                    if (this.shiftsResults.length > 0) {
                        for (let entry of this.shiftsResults) {
                            if (entry) {
                                var fromTime = new Date(entry.fromTime)
                                var toTime = new Date(entry.toTime)

                                //Day
                                if ((fromTime.getHours() >= 12 && fromTime.getHours() <= 19)
                                    && (toTime.getHours() >= 12 && toTime.getHours() <= 19)) {
                                    this.shiftOne = entry.title
                                    this.idShiftOne = entry.id
                                    this.danceTotal()
                                    this.total()
                                    this.schedulesDances()
                                }

                                //Night
                                if ((fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                    && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {

                                    this.shiftTwo = entry.title
                                    this.idShiftTwo = entry.id
                                    this.danceTotalTwo()
                                    this.totalTwo()
                                    this.schedulesDancesTwo()
                                }

                            }
                        }
                    }

                   /* if (this.idShiftOne > 0){
                        
                        this.danceTotal()
                        this.total()
                        this.schedulesDances()
                    }*/
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

    addValue() {
         this.appBaseService.addValue("NextNew");
    }

    counter(i: number) {
        return new Array(i);
    }

    schedulesDances() {
        this.shiftId = this.idShiftOne
        this.appBaseService.getScheduleByShiftTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.shiftId)
            .subscribe(response => {
                if (response.result) {
                    this.schedulesResults = response.result
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

        schedulesDancesTwo() {
            this.appBaseService.getScheduleByShiftTotal('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.idShiftTwo)
                .subscribe(response => {
                    if (response.result) {
                        this.schedulesResultsTwo = response.result
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

        countDanceObj(posSchedule, dance){
            
            var result = 0
            var id
            var obj 
            
            if (this.scheduleDay != undefined) {
                id = this.scheduleDay[posSchedule].id        
            }

            if (this.schedulesResults.length > 0){
            obj = this.schedulesResults.find(val => val.scheduleId == id && dance.codeDance == val.codeDance)
            
            }
            if (obj != undefined){
             result = obj.count
            }
            return result
        }

        countDanceObjTwo(posSchedule, dance){
            var result = 0
            var id
            if (this.schedulesResultsTwo != undefined) {
                id = this.scheduleNight[posSchedule].id
            }
            if (this.schedulesResultsTwo.length > 0){
            var obj = this.schedulesResultsTwo.find(val => val.scheduleId == id && dance.codeDance == val.codeDance)
            }
            if (obj != undefined){
             result = obj.count
            }
            return result
        }

        scheduleObj(i){
            var val
            if (this.scheduleDay != undefined){
                val = this.scheduleDay[i]
            }
            return val
        }

        scheduleObjTwo(i){
            var val
            if (this.scheduleNight!= undefined){
                val = this.scheduleNight[i]
            }
            return val
        }

        baseDances() {
            this.appBaseService.list('DanceBase', 0, 200000)
                .subscribe(response => {
                    if (response.result) {
                        this.baseDancesResults = response.result.items;
                        
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

        getHour(posSchedule) {
            var today = new Date(this.dateNow)
            var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
            var date = new Date(latestDate)
            var obj 
            if (this.scheduleDay != undefined) {
            obj = this.scheduleDay[posSchedule]
    
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
        }
         return isCurrentHour
        }

        getHourNight(posSchedule) {
            var today = new Date(this.dateNow)
            var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
            var date = new Date(latestDate)
            var obj 
            if (this.scheduleNight != undefined) {
            obj = this.scheduleNight[posSchedule]
    
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

}
