import { Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { FloorDanceTypeDto } from '../../shared/entities/floorDanceType';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-floorDanceTypeCE',
    templateUrl: './floorDanceTypeCE.component.html',
    styleUrls: ['./floorDanceTypeCE.component.css']
})

export class FloorDanceTypeCEComponent extends AppComponentBase implements OnInit {
    entityDto: FloorDanceTypeDto
    isLoadingResults: boolean = false
    keysResults: any[] = [] 
    shiftsResults: any[] = [] 
    entertainersResults: any[] = [] 
    danceTypesResults: any[] = []

    public showSpinners = true;
    public showSeconds = true;
    public touchUi = true;
    public enableMeridian = true;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';

    form = this.fb.group({

        activityTodayId: ['', Validators.required],
        danceTypeId: [''],
        keyId: ['', /*Validators.required*/],
        shiftId: [''],
        start: ['',],
        end: [''],
        count: ['']

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder, public datepipe: DatePipe) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new FloorDanceTypeDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.keys()
        this.shifts()
        this.entertainers()
        this.danceTypes()

    }

    get keyIdControl(): AbstractControl | null {
        return this.form.get('keyId');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    keys() {
        this.appBaseService.list('TypeBusinessElement', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.keysResults = response.result.items;
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

    danceTypes() {
        this.appBaseService.list('DanceType', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.danceTypesResults = response.result.items;
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

    entertainers() {
        this.appBaseService.getIsActiveToday('ActivityToday', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.entertainersResults = response.result.items;
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

    shifts() {
        this.appBaseService.list('Shift', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.shiftsResults = response.result.items;
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

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('FloorDanceType', this.entityDto)
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
        } else {
            this.appBaseService.update('FloorDanceType', this.entityDto)
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

        }
    }

    updateForm() {
        this.form.patchValue({
            activityTodayId: this.entityDto.activityTodayId,
            danceTypeId: this.entityDto.danceTypeId,
            keyId: this.entityDto.keyId,
            shiftId: this.entityDto.shiftId,
            start: this.entityDto.start,
            end: this.entityDto.end,
            count: this.entityDto.count
        });
    }

    updateDto() {
        
        var start = Date.now()
        var today = new Date(start)
        let latest_date = this.datepipe.transform(today, 'yyyy-MM-dd HH:mm:ss');
        this.form.get("start").setValue(latest_date)
        
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);

                localStorage.setItem("activityTodayId", this.entityDto.activityTodayId)
    }


}
