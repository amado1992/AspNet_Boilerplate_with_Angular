import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { PagedResult } from "../utils/PagedResult";
import { Response } from "../utils/Response";
import { catchError, tap } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { API_BASE_URL} from '@shared/service-proxies/service-proxies';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
};

@Injectable()
export class AppCrudBaseService {
    private http: HttpClient;
    private baseUrl: string;
    valor = new BehaviorSubject<string>('NextOne');//emite eventos que ocurren
    lanzamiento = this.valor.asObservable();

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
        this.baseUrl = this.baseUrl.replace(/[?&]$/, "");
        this.baseUrl = this.baseUrl + "/api/services/app/";
        
    }

    addValue(nuevoValor) {
        this.valor.next(nuevoValor);
    }

    list(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetAll?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        );
    }

    getIsActiveToday(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetIsActiveToday?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        );
    }

    getActivityToday(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetActivityToday?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        );
    }

    getFloorDanceId(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetFloorDanceId?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getQuotaId(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetQuotaId?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getQuotaSumaryId(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetQuotaSumaryId?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }
    
    create(entityName: string, entityDto: any): Observable<any> {
        return this.http.post(this.baseUrl + entityName + '/Create', entityDto, httpOptions)
            .pipe(
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    update(entityName: string, entityDto: any): Observable<any> {
        return this.http.put(this.baseUrl + entityName + '/Update', entityDto, httpOptions)
            .pipe(
                catchError((err: HttpResponseBase) => {
                    return throwError(err);
                })
            );
    }

    delete(entityName: string, entityDto): Observable<any> {
        return this.http.delete(this.baseUrl + entityName + '/Delete?Id=' + entityDto.id, httpOptions)
            .pipe(
                catchError((err: HttpResponseBase) => {
                    return throwError(err);
                })
            );
    }

    get(entityName: string, id: number): Observable<any> {
        return this.http.get(this.baseUrl + entityName + '/Get?id=' + id, httpOptions);
    }

    getSearch(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = {active: "", direction: ""}): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetAll?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        )
            .pipe(
                tap((response: Response<any>) => {
                    response.result = response.result;
                    return response;
                })
            );
    }

    updateRow(entityName: string, entityDto: any): Observable<any> {
        return this.http.put(this.baseUrl + entityName + '/UpdateRow?id=' + entityDto, "", httpOptions)
            .pipe(
                catchError(error => {
                    return throwError(error);
                })
            );
    }
    getDanceTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetDanceTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" },shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getDanceSumTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetDanceSumTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        );
    }

    getSumTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSumTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}`,
            httpOptions
        );
    }

    /*getSheduleDanceId(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId, danceId?, start?, end?, scheduleId?): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSheduleDanceId?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}&DanceId=${danceId}&Start=${start}&End=${end}&ScheduleId=${scheduleId}`,
            httpOptions
        );
    }*/
    getSheduleDanceId(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSheduleDanceId?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getScheduleByShiftTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetRangeByShiftTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    postFile(entityName: string, entityDto: any): Observable<any> {
        const httpOptionsFormDta = {
           headers: new HttpHeaders({
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            })
       };
        //return this.http.post(this.baseUrl + entityName + '/PostFile', entityDto)//ok
        return this.http.post(this.baseUrl + entityName + '/PostFile', entityDto)
            .pipe(
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    getDocumentsById(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetDocumentsById?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}`,
            httpOptions
        );
    }

    getFile(entityName: string, idFile): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetFile?idFile=${idFile}`,
            { responseType: "blob" }
        );
    }

    postBaseFee(entityName: string, entityDto: any): Observable<any> {
        return this.http.post(this.baseUrl + entityName + '/PostBaseFee', entityDto, httpOptions)
            .pipe(
                catchError(error => {
                    return throwError(error);
                })
            );
    }

    getFloorDanceIdReport(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetFloorDanceIdReport?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getSumQuotaReport(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSumQuotaReport?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }
    
    listFilter(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, date): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetFilterDate?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&Start=${date}`,
            httpOptions
        );
    }

    getTypeBusinessElements(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetTypeBusinessElements?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}`,
            httpOptions
        );
    }
    getSubTypeBusinessElements(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSubTypeBusinessElements?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}`,
            httpOptions
        );
    }

    GetMainBusinessElements(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetMainBusinessElements?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}`,
            httpOptions
        );
    }
    getPriceTypeBusinessElement(entityName: string, id: number): Observable<any> {
        return this.http.get(this.baseUrl + entityName + '/GetPriceTypeBusinessElement?id=' + id, httpOptions);
    }

    getAccountings(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetAccountings?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getGroupTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetGroupTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getRevenueHistorical(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, start, end, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetRevenueHistorical?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&Start=${start}&End=${end}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getRevenueHistoricalAll(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetRevenueHistoricalAll?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getOfMain(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetOfMain?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}`,
            httpOptions
        );
    }

    getSectionTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, id, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetSectionTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&FilterForId=${id}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    getRevenuesTotal(entityName: string, skipCount: number, maxResultCount: number, filter: string = "", sort: Sort = { active: "", direction: "" }, shiftId): Observable<any> {
        return this.http.get(
            this.baseUrl + entityName + `/GetRevenuesTotal?SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filter}&Sorting=${sort.active} ${sort.direction}&ShiftId=${shiftId}`,
            httpOptions
        );
    }

    public errorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 400: {
                return `Error status: ${error.status} Bad Input`;
            }
            case 404: {
                return `Error status: ${error.status} Resource Not Found`;
            }
            case 403: {
                return `Error status: ${error.status} Access Denied`;
            }
            case 500: {
                return "Internal Server Error";
            }
            default: {
                return "Unknown Server Error";
            }

        }

    }

}
