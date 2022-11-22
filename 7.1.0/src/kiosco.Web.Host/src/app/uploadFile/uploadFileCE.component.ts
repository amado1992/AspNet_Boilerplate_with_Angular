import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { UploadDto } from '../../shared/entities/upload';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-uploadFile-ce',
    templateUrl: './uploadFileCE.component.html',
    styleUrls: ['./uploadFileCE.component.css']
})

export class UploadFileCEComponent extends AppComponentBase implements OnInit {
    entityDto: UploadDto
    isLoadingResults: boolean = false

    form = this.fb.group({

        title: ['', Validators.required]

    });

    myFiles:string [] = [];
    sMsg:string = '';
    progress = 0;

    constructor(injector: Injector, public dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) public data: any, private appBaseService: AppCrudBaseService,
        private fb: FormBuilder) {
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
        console.log(this.myFiles)
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

}
