import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { PriceShiftDto } from '../../shared/entities/priceShift';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-priceShiftCE',
    templateUrl: './priceShiftCE.component.html',
    styleUrls: ['./priceShiftCE.component.css']
})

export class PriceShiftCEComponent extends AppComponentBase implements OnInit {
    entityDto: PriceShiftDto
    isLoadingResults: boolean = false
    keysResults: any[] = [] 
    shiftsResults: any[] = [] 
    form = this.fb.group({

        price: [''],
        percent: [''],
        typeBusinessElementId: ['', Validators.required],
        shiftId: ['']

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new PriceShiftDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.keys()
        this.shifts()

    }

    get priceControl(): AbstractControl | null {
        return this.form.get('price');
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

            this.appBaseService.create('PriceShift', this.entityDto)
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
            this.appBaseService.update('PriceShift', this.entityDto)
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

            price: this.entityDto.price,
            typeBusinessElementId: this.entityDto.typeBusinessElementId,
            shiftId: this.entityDto.shiftId,
            percent: this.entityDto.percent,
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }


}
