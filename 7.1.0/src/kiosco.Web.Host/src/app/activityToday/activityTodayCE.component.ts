import { Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ActivityTodayDto } from '../../shared/entities/activityToday';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';

@Component({
    selector: 'app-activityTodayCE',
    templateUrl: './activityTodayCE.component.html',
    styleUrls: ['./activityTodayCE.component.css']
})

export class ActivityTodayCEComponent extends AppComponentBase implements OnInit {
    entityDto: ActivityTodayDto
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

        entertainerId: ['', Validators.required],
        isActive: [''],
        input: [new Date(2021,9,4,5,6,7), Validators.required],
        output: [new Date(2021,9,4,5,6,7)]

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new ActivityTodayDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.entertainers()

    }

    get keyIdControl(): AbstractControl | null {
        return this.form.get('keyId');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    entertainers() {
        this.appBaseService.list('Entertainer', 0, 200000)
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

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('ActivityToday', this.entityDto)
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
            this.appBaseService.update('ActivityToday', this.entityDto)
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
            entertainerId: this.entityDto.entertainerId,
            isActive: this.entityDto.isActive,
            input: this.entityDto.input,
            output: this.entityDto.output
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }


}
