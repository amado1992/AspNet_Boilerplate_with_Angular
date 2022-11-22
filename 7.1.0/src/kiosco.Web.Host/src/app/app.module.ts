import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';

//service
import { AppCrudBaseService } from '@app/app-crud-base/app-crud-base.service';
//material
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';   
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';  
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';     
//component
import { EntertainerCEComponent } from "../app/entertainer/entertainerCE.component";
import { EntertainerComponent } from "../app/entertainer/entertainer.component";
import { ClubComponent } from "../app/club/club.component";
import { ClubCEComponent } from "../app/club/clubCE.component";
import { JobComponent } from "../app/job/job.component";
import { JobCEComponent } from "../app/job/jobCE.component";
import { ShiftCEComponent } from "../app/shift/shiftCE.component";
import { ShiftComponent } from "../app/shift/shift.component";
import { KeyCEComponent } from "../app/key/keyCE.component";
import { KeyComponent } from "../app/key/key.component";
import { GroupCEComponent } from "../app/group/groupCE.component";
import { GroupComponent } from "../app/group/group.component";
import { PriceShiftCEComponent } from "../app/priceShift/priceShiftCE.component";
import { PriceShiftComponent } from "../app/priceShift/priceShift.component";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FloorDanceTypeComponent } from "../app/floorDanceType/floorDanceType.component";
import { FloorDanceTypeCEComponent } from "../app/floorDanceType/floorDanceTypeCE.component";
import { ActivityTodayComponent } from "../app/activityToday/activityToday.component";
import { ActivityTodayCEComponent } from "../app/activityToday/activityTodayCE.component";
import { DanceTypeComponent } from "../app/danceType/danceType.component";
import { DanceTypeCEComponent } from "../app/danceType/danceTypeCE.component";
import { FloorWorkerBoardComponent } from "../app/floorWorkerBoard/floorWorkerBoard.component";
import { FloorWorkerElementComponent } from "../app/floorWorkerElement/floorWorkerElement.component";
import { SongCEComponent } from "../app/song/songCE.component";
import { SongComponent } from "../app/song/song.component";
import { SongDanceTypeComponent } from "../app/songDanceType/songDanceType.component";
import { SongDanceTypeCEComponent } from "../app/songDanceType/songDanceTypeCE.component";
import {ScrollingModule} from '@angular/cdk/scrolling';

import { TotalComponent } from "../app/total/total.component";
import { ReportComponent } from "../app/report/report.component";
import { UploadFileCEComponent} from "../app/uploadFile/uploadFileCE.component";
import { DownloadFileCEComponent} from "../app/downloadFile/downloadFileCE.component";
import {HiredByCEComponent} from '../app/hiredBy/hiredByCE.component';
import {HiredByComponent} from '../app/hiredBy/hiredBy.component';
import {ManagerComponent} from '../app/manager/manager.component';
import {ManagerCEComponent} from '../app/manager/managerCE.component';
import { ReportOneComponent } from "./reportOne/reportOne.component";
import { ReportOneElementComponent } from "./reportOneElement/reportOneElement.component";
import { FloorReportTotalComponent } from "./floorReportTotal/floorReportTotal.component";
import { SubComponent } from "./sub/sub.component";
import { SubCEComponent } from "./sub/subCE.component";
import { WaitressRevenuesCEComponent } from "./waitress-revenues/waitress-revenuesCE.component";
import { WaitressRevenuesComponent } from "./waitress-revenues/waitress-revenues.component";
import { DepositBagReportComponent } from "./deposit-bag-report/deposit-bag-report.component";
import { SectionBagReportComponent } from "./section-bag-report/section-bag-report.component";
import { BlackFormComponent } from "./black-form/black-form.component";
import { RevenueHistoricalComponent } from "./revenue-historical/revenue-historical.component";
import { SubDepositComponent } from "./sub-deposit/sub-deposit.component";
import { AccountingComponent } from "./accounting/accounting.component";
import { BoardAccountingComponent } from "./board-accounting/board-accounting.component";

//ngx-bootstrap
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BlackFormCEComponent } from './black-form/black-formCE.component';
//Others
import { NgxCaptureModule } from 'ngx-capture';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    //components
    EntertainerComponent,
    EntertainerCEComponent,
    ClubComponent,
    ClubCEComponent,
    JobComponent,
    JobCEComponent,
    ShiftCEComponent,
    ShiftComponent,
    KeyCEComponent,
    KeyComponent,
    GroupCEComponent,
    GroupComponent,
    PriceShiftCEComponent,
    PriceShiftComponent,
    FloorDanceTypeCEComponent,
    FloorDanceTypeComponent,
    ActivityTodayCEComponent,
    ActivityTodayComponent,
    DanceTypeCEComponent,
    DanceTypeComponent,
    FloorWorkerBoardComponent,
    FloorWorkerElementComponent,
    SongCEComponent,
    SongComponent,
    SongDanceTypeCEComponent,
    SongDanceTypeComponent,
    TotalComponent,
    ReportComponent,
    UploadFileCEComponent,
    DownloadFileCEComponent,
    HiredByCEComponent,
    HiredByComponent,
    ManagerCEComponent,
    ManagerComponent,
    ReportOneComponent,
    ReportOneElementComponent,
    FloorReportTotalComponent,
    SubCEComponent,
    SubComponent,
    WaitressRevenuesComponent,
    WaitressRevenuesCEComponent,
    DepositBagReportComponent,
    SectionBagReportComponent,
    BlackFormComponent,
    BlackFormCEComponent,
    RevenueHistoricalComponent,
    SubDepositComponent,
    AccountingComponent,
    BoardAccountingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    //material
    MatSliderModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatGridListModule,
    ScrollingModule,
    //others
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    ProgressbarModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxCaptureModule
  ],
  providers: [AppCrudBaseService, DatePipe],
  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
    //components
    EntertainerCEComponent,
    ClubCEComponent,
    JobCEComponent,
    ShiftCEComponent,
    KeyCEComponent,
    GroupCEComponent,
    PriceShiftCEComponent,
    FloorDanceTypeCEComponent,
    ActivityTodayCEComponent,
    DanceTypeCEComponent,
    SongCEComponent,
    SongDanceTypeCEComponent,
    TotalComponent,
    UploadFileCEComponent,
    DownloadFileCEComponent,
    //ReportComponent
    HiredByCEComponent,
    ManagerCEComponent,
    SubCEComponent,
    WaitressRevenuesCEComponent,
    BlackFormCEComponent,
    BoardAccountingComponent
  ]
})
export class AppModule {}
