import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, FormControl, Validators } from "@angular/forms";
import { UploadDto } from '../../shared/entities/upload';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-revenue-historical',
    templateUrl: './revenue-historical.component.html',
    styleUrls: ['./revenue-historical.component.css']
})

export class RevenueHistoricalComponent extends AppComponentBase implements OnInit {
    entityDto: UploadDto
    isLoadingResults: boolean = false
    shiftsResults: any[] = []
    shiftId = new FormControl(0);
    dateNow = Date.now()
    form = this.fb.group({

        title: ['', Validators.required]

    });

    myFiles:string [] = [];
    sMsg:string = '';
    progress = 0;
    order: Sort;
    filter: any
    revenueHistoricalYearOne: any
    revenueHistoricalYearThree: any
    revenueHistoricalAll: any
    shiftName: any = ""
    revenuesTotal: any

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder, public datepipe: DatePipe) {
        super(injector);


        if (data.entity != null) {
            this.entityDto = new UploadDto()
            this.entityDto.entertainerId = data.entity.id;
        }
        else {

            this.entityDto = new UploadDto();

        }
    }

    ngOnInit(): void {
        var shifId = localStorage.getItem("shiftIdRevenue")
        if (shifId) {
            this.shiftId.setValue(JSON.parse(shifId))
        }
        this.order = { active: "", direction: "" };

        this.filter = "";
        this.updateForm()
        this.shifts()
    }

    get titleControl(): AbstractControl | null {
        return this.form.get('title');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        //if (this.entityDto.id == 0) {

            this.appBaseService.create('Document', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("New element successfully created.")
                    this.dialogRef.close(true)
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
        //} else {
            this.appBaseService.update('Document', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("A new element has been successfully updated.")
                    this.dialogRef.close(true)
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

       // }
    }

    updateForm() {
        this.form.patchValue({

            //title: this.entityDto.title
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }
    getFileDetails (e) {
        //console.log (e.target.files);
        for (var i = 0; i < e.target.files.length; i++) { 
          this.myFiles.push(e.target.files[i]);
        }
        
      }
    
      uploadFiles () {
        const frmData = new FormData();
        
        for (var i = 0; i < this.myFiles.length; i++) { 
          frmData.append("files", this.myFiles[i]);
        }
        frmData.append("entertainerId", this.entityDto.entertainerId)

        this.appBaseService.postFile('Document', frmData)
                .subscribe(event => {
                    abp.notify.info("New element successfully created.")
                    this.dialogRef.close(true)
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

      shifts() {
        this.appBaseService.list('Shift', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.shiftsResults = response.result.items;
                    var today = new Date(this.dateNow)
                    var latestDate = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
                    var date = new Date(latestDate)

                    var shifId = localStorage.getItem("shiftIdRevenue")
                    
                    if (shifId) {

                        var entry = this.shiftsResults.find(val => val.id == JSON.parse(shifId))
                        if (entry == undefined) {
                            localStorage.removeItem("shiftIdRevenue")

                            for (let entry of this.shiftsResults) {

                                var fromTime = new Date(entry.fromTime)
                                var toTime = new Date(entry.toTime)

                                if ((date.getHours() >= 12 && date.getHours() <= 19)
                                    && (fromTime.getHours() >= 12 && fromTime.getHours() <= 19)
                                    && (toTime.getHours() >= 12 && toTime.getHours() <= 19)) {
                                    this.shiftId.setValue(entry.id)
                                }

                                if ((date.getHours() >= 19 || (date.getHours() >= 0 && date.getHours() <= 2))
                                    && (fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                    && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                    this.shiftId.setValue(entry.id)
                                }

                                if ((date.getHours() > 2 && date.getHours() < 12)
                                    && (fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                    && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                    this.shiftId.setValue(entry.id)
                                }

                            }
                        }
                    } else {
                        for (let entry of this.shiftsResults) {

                            var fromTime = new Date(entry.fromTime)
                            var toTime = new Date(entry.toTime)

                            if ((date.getHours() >= 12 && date.getHours() <= 19)
                                && (fromTime.getHours() >= 12 && fromTime.getHours() <= 19)
                                && (toTime.getHours() >= 12 && toTime.getHours() <= 19)) {
                                this.shiftId.setValue(entry.id)
                            }

                            if ((date.getHours() >= 19 || (date.getHours() >= 0 && date.getHours() <= 2))
                                && (fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                                && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                this.shiftId.setValue(entry.id)
                            }

                            if ((date.getHours() > 2 && date.getHours() < 12)
                            && (fromTime.getHours() >= 19 || (fromTime.getHours() >= 0 && fromTime.getHours() <= 2))
                            && (toTime.getHours() >= 19 || (toTime.getHours() >= 0 && toTime.getHours() <= 2))) {
                                this.shiftId.setValue(entry.id)
                            }

                        }
                    }

                    var entry = this.shiftsResults.find(val => val.id == this.shiftId.value)

                    if (entry != undefined) {
                        this.shiftName = entry.title
                    }
                    this.getRevenueHistoricalYearOne()
                    this.getRevenueHistoricalYearThree()
                    this.getRevenueHistoricalAll()
                    this.getRevenuesTotal()
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
    selectShift(event: Event) {

        var selected = (event.target as HTMLSelectElement).value;
        
        var entry = this.shiftsResults.find(val => val.id == selected)
        if (entry != undefined) {
            this.shiftName = entry.title
        }
        
        localStorage.setItem("shiftIdRevenue", JSON.stringify(selected))
        this.getRevenueHistoricalYearOne()
        this.getRevenueHistoricalYearThree()
        this.getRevenueHistoricalAll()
        this.getRevenuesTotal()
    }

    getRevenueHistoricalYearOne() {

        var endYearFromNow = new Date(this.dateNow)
        var endTranf = this.datepipe.transform(endYearFromNow, 'yyyy-MM-dd HH:mm:ss');
                    
        var startYear = endYearFromNow.setFullYear(endYearFromNow.getFullYear() - 1)                  
        var start = new Date(startYear)
        var startTranf = this.datepipe.transform(start, 'yyyy-MM-dd HH:mm:ss');

        this.appBaseService.getRevenueHistorical('AccountingPerShift', 0, 200000, this.filter, this.order, startTranf, endTranf, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {
                    
                    this.revenueHistoricalYearOne = response.result;
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

    getRevenueHistoricalYearThree() {

        var endYearFromNow = new Date(this.dateNow)
        var endTranf = this.datepipe.transform(endYearFromNow, 'yyyy-MM-dd HH:mm:ss');
                    
        var startYear = endYearFromNow.setFullYear(endYearFromNow.getFullYear() - 3)                  
        var start = new Date(startYear)
        var startTranf = this.datepipe.transform(start, 'yyyy-MM-dd HH:mm:ss');

        this.appBaseService.getRevenueHistorical('AccountingPerShift', 0, 200000, this.filter, this.order, startTranf, endTranf, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {
                    
                    this.revenueHistoricalYearThree = response.result;
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

    getRevenueHistoricalAll() {

        this.appBaseService.getRevenueHistoricalAll('AccountingPerShift', 0, 200000, this.filter, this.order, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {
                    
                    this.revenueHistoricalAll = response.result;
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

    getRevenuesTotal() {
        this.appBaseService.getRevenuesTotal('TypeBusinessElement', 0, 200000, this.filter, this.order, this.shiftId.value)
            .subscribe(response => {
                if (response.result) {

                    this.revenuesTotal = response.result;
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
