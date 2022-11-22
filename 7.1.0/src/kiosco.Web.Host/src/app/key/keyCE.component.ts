import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { KeyDto } from '../../shared/entities/key';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-keyCE',
    templateUrl: './keyCE.component.html',
    styleUrls: ['./keyCE.component.css']
})

export class KeyCEComponent extends AppComponentBase implements OnInit {
    entityDto: KeyDto
    isLoadingResults: boolean = false
    groupsResults: any[] = [] 
    subsResults: any[] = []

    form = this.fb.group({

        name: ['', Validators.required],
        mainBusinessElementId: [''],
        subBusinessElementId: ['']

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new KeyDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.groups()
        this.subs()

    }

    get nameControl(): AbstractControl | null {
        return this.form.get('name');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    groups() {
        this.appBaseService.list('MainBusinessElement', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.groupsResults = response.result.items;
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

    subs() {
        this.appBaseService.list('SubBusinessElement', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.subsResults = response.result.items;
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

            this.appBaseService.create('TypeBusinessElement', this.entityDto)
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
            this.appBaseService.update('TypeBusinessElement', this.entityDto)
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
            name: this.entityDto.name,
            mainBusinessElementId: this.entityDto.mainBusinessElementId,
            subBusinessElementId: this.entityDto.subBusinessElementId
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }


}
