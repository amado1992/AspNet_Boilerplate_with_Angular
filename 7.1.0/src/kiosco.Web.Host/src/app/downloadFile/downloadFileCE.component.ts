import { Component, Inject, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from "../../shared/app-component-base";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppCrudBaseService } from "../app-crud-base/app-crud-base.service";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { UploadDto } from '../../shared/entities/upload';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';

@Component({
    selector: 'app-downloadFile-ce',
    templateUrl: './downloadFileCE.component.html',
    styleUrls: ['./downloadFileCE.component.css']
})

export class DownloadFileCEComponent extends AppComponentBase implements OnInit {
    entityDto: UploadDto
    isLoadingResults: boolean = false

    form = this.fb.group({

        title: ['', Validators.required]

    });

    myFiles:string [] = [];
    sMsg:string = '';

    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    filter: string;
    searchIcon: string;
    clearIconColor: string;
    order: Sort;
    documents: any[] = []

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
        this.order = { active: "", direction: "" };
        this.filter = "";
        this.searchIcon = "search";
        this.clearIconColor = "";
        this.loadDocuments()
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
                .subscribe(response => {
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

      loadDocuments() {
        this.appBaseService.getDocumentsById('Document', this.currentPage * this.pageSize, this.pageSize, this.filter, this.order, this.entityDto.entertainerId)
            .subscribe(response => {
             this.documents = response.result.items
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

    downloadFile(id, fileName){
        this.appBaseService.getFile('Document', id)
        .subscribe(response => {
         const url = window.URL.createObjectURL(new Blob([response]));
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", fileName);
         document.body.appendChild(link);
         link.click();
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

    deleteFile(entry): void {
        abp.message.confirm("Are you sure you want to delete this information?.",
            "Information",
            (result: boolean) => {
                if (result) {
                    this.appBaseService.delete("Document", entry)
                        .subscribe(response => {
                            if (response.success) {
                                abp.notify.info("The element was successfully removed");
                                this.loadDocuments();
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
                        })
                }
            }
        );
    }


}
