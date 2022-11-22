import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { JobDto } from '../../shared/entities/job';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-jobCE',
    templateUrl: './jobCE.component.html',
    styleUrls: ['./jobCE.component.css']
})

export class JobCEComponent extends AppComponentBase implements OnInit {
    entityDto: JobDto
    isLoadingResults: boolean = false

    form = this.fb.group({

        title: ['', Validators.required]

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new JobDto();

        }
    }

    ngOnInit(): void {
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

            this.appBaseService.create('Job', this.entityDto)
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
            this.appBaseService.update('Job', this.entityDto)
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

            title: this.entityDto.title
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }


}
