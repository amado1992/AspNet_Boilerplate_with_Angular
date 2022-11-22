import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ShiftDto } from '../../shared/entities/shift';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-shiftCE',
    templateUrl: './shiftCE.component.html',
    styleUrls: ['./shiftCE.component.css']
})

export class ShiftCEComponent extends AppComponentBase implements OnInit {
    entityDto: ShiftDto
    isLoadingResults: boolean = false
    ismeridian = true;
    mytime: Date = new Date();
    form = this.fb.group({

        title: ['', Validators.required],
        fromTime: [this.mytime, Validators.required],
        toTime: [this.mytime, Validators.required]

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder, public datepipe: DatePipe) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new ShiftDto();

        }
    }

    ngOnInit(): void {
        /*var start = Date.now()
        var today = new Date(start)
        this.entityDto.fromTime = today
        this.entityDto.toTime = today*/
        this.updateForm()
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
        if (this.entityDto.id == 0) {

            this.appBaseService.create('Shift', this.entityDto)
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
            this.appBaseService.update('Shift', this.entityDto)
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

            title: this.entityDto.title,
            fromTime: this.entityDto.fromTime,
            toTime: this.entityDto.toTime
        });
    }

    updateDto() {
        /*var start = Date.now()
        var today = new Date(start)*/
        this.entityDto.fromTime = this.datepipe.transform(this.entityDto.fromTime, 'yyyy-MM-dd HH:mm:ss');
        this.entityDto.toTime = this.datepipe.transform(this.entityDto.toTime, 'yyyy-MM-dd HH:mm:ss');
        
        //var latest_date = this.datepipe.transform(today, 'yyyy-MM-dd HH:m:ss')m;
        
        console.log("Mi data ", this.entityDto)
        /*this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);*/
    }   

    toggleMode(): void {
        this.ismeridian = !this.ismeridian;
      }

}
