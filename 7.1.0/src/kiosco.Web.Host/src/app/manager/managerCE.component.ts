import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { ManagerDto } from '@shared/entities/manager';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-managerCE',
    templateUrl: './managerCE.component.html',
    styleUrls: ['./managerCE.component.css']
})

export class ManagerCEComponent extends AppComponentBase implements OnInit {
    entityDto: ManagerDto
    clubsResults: any[] = []
    jobsResults: any[] = []
    floorWorkersResults: any[] = []
    isLoadingResults: boolean = false
    categorys: any[] = []
    contractors: any[] = []
    hiredStatus: any[] = []
    

    form = this.fb.group({

        jobId: [''],
        clubId: [''],

        //info personal
        firstName: ['', Validators.required],
        lastName: [''],
        ssn: [''],
        address: [''],
        address2: [''],
        city: [''],
        state: [''],
        dlState: [''],
        dlNumber: [''],
        zipCode: [''],
        mobilePhone: [''],
        homePhone: [''],
        email: [''],
        dob: [''],
        //new field
        dateHired: [''],
        categoryId: [''],
    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new ManagerDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.clubs();
        this.jobs()
        this.loadCategorys()
        //this.loadContractors()
        this.loadHideStatus()

    }

    get firstNameControl(): AbstractControl | null {
        return this.form.get('firstName');
    }

    get lastNameControl(): AbstractControl | null {
        return this.form.get('lastName');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    save(): void {
        this.isLoadingResults = true

        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('Manager', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("New element successfully created.")
                    this.dialogRef.close(true)
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
        } else {
            this.appBaseService.update('Manager', this.entityDto)
                .subscribe(response => {
                    this.isLoadingResults = false
                    abp.notify.info("A new element has been successfully updated.")
                    this.dialogRef.close(true)
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
    }

    updateForm() {
        this.form.patchValue({

            jobId: this.entityDto.jobId,
            clubId: this.entityDto.clubId,


            firstName: this.entityDto.firstName,
            lastName: this.entityDto.lastName,
            ssn: this.entityDto.ssn,
            address: this.entityDto.address,
            address2: this.entityDto.address2,
            city: this.entityDto.city,
            state: this.entityDto.state,
            dlState: this.entityDto.dlState,
            dlNumber: this.entityDto.dlNumber,
            zipCode: this.entityDto.zipCode,
            mobilePhone: this.entityDto.mobilePhone,
            homePhone: this.entityDto.homePhone,
            email: this.entityDto.email,
            dob: this.entityDto.dob,

            //new field
            dateHired: this.entityDto.dateHired,
            categoryId: this.entityDto.categoryId
        });
    }

    updateDto() {
        console.log("Bien probando...", this.entityDto)
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }

    clubs() {
        this.appBaseService.list('Club', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.clubsResults = response.result.items;
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

    loadCategorys() {
        this.appBaseService.list('Category', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.categorys = response.result.items;
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

    loadContractors() {
        this.appBaseService.list('HiredBy', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.contractors = response.result.items;
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

    loadHideStatus() {
        this.appBaseService.list('HiredStatu', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.hiredStatus = response.result.items;
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

    jobs() {
        this.appBaseService.list('Job', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.jobsResults = response.result.items;
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

}
