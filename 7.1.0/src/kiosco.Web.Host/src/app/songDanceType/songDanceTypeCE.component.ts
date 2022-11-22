import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { SongDanceTypeDto } from '../../shared/entities/songDanceType';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-songdancetype-ce',
    templateUrl: './songDanceTypeCE.component.html',
    styleUrls: ['./songDanceTypeCE.component.css']
})

export class SongDanceTypeCEComponent extends AppComponentBase implements OnInit {
    entityDto: SongDanceTypeDto
    isLoadingResults: boolean = false
    songsResults: any[] = []
    danceTypesResults: any[] = []  
    form = this.fb.group({

        countDanceBySong: [''],
        songId: ['', Validators.required],
        danceTypeId: ['', Validators.required]

    });

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
        super(injector);


        if (data.entity != null) {

            this.entityDto = JSON.parse(JSON.stringify(data.entity));
        }
        else {

            this.entityDto = new SongDanceTypeDto();

        }
    }

    ngOnInit(): void {
        this.updateForm()
        this.songs()
        this.danceTypes()

    }

    get nameControl(): AbstractControl | null {
        return this.form.get('name');
    }

    cancel(): void {
        this.dialogRef.close();
    }

    songs() {
        this.appBaseService.list('Song', 0, 200000)
            .subscribe(response => {
                if (response.result) {
                    this.songsResults = response.result.items;
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

    save(): void {
        this.isLoadingResults = true
        this.updateDto()
        if (this.entityDto.id == 0) {

            this.appBaseService.create('SongDanceType', this.entityDto)
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
            this.appBaseService.update('SongDanceType', this.entityDto)
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

            countDanceBySong: this.entityDto.countDanceBySong,
            songId: this.entityDto.songId,
            danceTypeId: this.entityDto.danceTypeId
            
        });
    }

    updateDto() {
        this.entityDto
            = Object.assign(this.entityDto
                , this.form.value);
    }


}
