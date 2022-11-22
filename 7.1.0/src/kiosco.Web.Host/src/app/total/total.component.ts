import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { GroupDto } from '../../shared/entities/group';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-total',
    templateUrl: './total.component.html',
    styleUrls: ['./total.component.css']
})

export class TotalComponent extends AppComponentBase implements OnInit {
    entityDto: any
    isLoadingResults: boolean = false
    totalRows = 0;
    pageSize = 200000;
    currentPage = 0;
    order: any;
    filter: any;
    quotaSumaryResut: any[] = []
    quotaResut: any
    shiftId: any

    form = this.fb.group({

        name: ['', Validators.required]

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
    }

    ngOnInit(): void {
        this.shiftId = JSON.parse(localStorage.getItem("shiftId"))
        this.order = { active: "", direction: "" };

        this.filter = "";
        this.quota()
        this.updateForm()

    }

    get nameControl(): AbstractControl | null {
        return this.form.get('name');
    }

    cancel(): void {
        console.log("qqq")
        this.dialogRef.close();
    }

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('Group', this.entityDto)
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
            this.appBaseService.update('Group', this.entityDto)
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

            name: this.entityDto.name
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }

    quota() {

        if (this.entityDto != undefined) {
            if(this.shiftId != null){
            this.appBaseService.getQuotaId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.entityDto.id, this.shiftId)
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

            }else {
                    abp.notify.info("Please select a shift")
                }
        }
    }

    quotaSumary() {

        if (this.entityDto != undefined) {
            if(this.shiftId != null){
            this.appBaseService.getQuotaSumaryId('FloorDanceType', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.entityDto.id, this.shiftId)
                .subscribe(response => {
                    if (response.result) {
                        this.quotaSumaryResut = response.result
                        this.quota()
                        localStorage.setItem("sumaryCaluculate", "good")
                        this.addValue()
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
    }

    addValue() {
         this.appBaseService.addValue("NextNew");
    }

}
