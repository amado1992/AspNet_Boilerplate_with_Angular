import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { EntertainerComponent } from './entertainer/entertainer.component';
import { ClubComponent } from './club/club.component';
import { JobComponent } from './job/job.component';
import { ShiftComponent } from './shift/shift.component';
import { KeyComponent } from './key/key.component';
import { PriceShiftComponent } from './priceShift/priceShift.component';
import { GroupComponent } from './group/group.component';
import { FloorDanceTypeComponent } from './floorDanceType/floorDanceType.component';
import { ActivityTodayComponent } from './activityToday/activityToday.component';
import { DanceTypeComponent } from './danceType/danceType.component';
import { FloorWorkerBoardComponent } from './floorWorkerBoard/floorWorkerBoard.component';
import { SongComponent } from './song/song.component';
import { SongDanceTypeComponent } from './songDanceType/songDanceType.component';
import { HiredByComponent } from './hiredBy/hiredBy.component';
import { ManagerComponent } from './manager/manager.component';
import { ReportOneComponent } from './reportOne/reportOne.component';
import { SubComponent } from './sub/sub.component';
import { WaitressRevenuesComponent } from './waitress-revenues/waitress-revenues.component';
import { BlackFormComponent } from './black-form/black-form.component';
import { AccountingComponent } from './accounting/accounting.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent,  canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent, canActivate: [AppRouteGuard] },
                    { path: 'update-password', component: ChangePasswordComponent, canActivate: [AppRouteGuard] },
                    //component
                    { path: 'entertainers', component: EntertainerComponent, data: { permission: 'Pages.Entertainers' }, canActivate: [AppRouteGuard] },
                    { path: 'clubs', component: ClubComponent, data: { permission: 'Pages.Clubs' }, canActivate: [AppRouteGuard] },
                    { path: 'jobs', component: JobComponent, data: { permission: 'Pages.Jobs' }, canActivate: [AppRouteGuard] },
                    { path: 'shifts', component: ShiftComponent, data: { permission: 'Pages.Shifts' }, canActivate: [AppRouteGuard] },
                    { path: 'keys', component: KeyComponent, data: { permission: 'Pages.TypeBusinessElements' }, canActivate: [AppRouteGuard] },
                    { path: 'schedules', component: PriceShiftComponent, data: { permission: 'Pages.PriceShifts' }, canActivate: [AppRouteGuard] },
                    { path: 'groups', component: GroupComponent, data: { permission: 'Pages.MainBusinessElements' }, canActivate: [AppRouteGuard] },
                    { path: 'floor_danceTypes', component: FloorDanceTypeComponent, data: { permission: 'Pages.FloorDanceTypes' }, canActivate: [AppRouteGuard] },
                    { path: 'lineup', component: ActivityTodayComponent, data: { permission: 'Pages.ActivityTodays' }, canActivate: [AppRouteGuard] },
                    { path: 'danceTypes', component: DanceTypeComponent, data: { permission: 'Pages.DanceTypes' }, canActivate: [AppRouteGuard] },
                    { path: 'floor_worker_borad', component: FloorWorkerBoardComponent, data: { permission: 'Pages.FloorDanceTypes' }, canActivate: [AppRouteGuard] },
                    { path: 'songs', component: SongComponent, data: { permission: 'Pages.Songs' }, canActivate: [AppRouteGuard] },
                    { path: 'song_dancetypes', component: SongDanceTypeComponent, data: { permission: 'Pages.SongDanceTypes' }, canActivate: [AppRouteGuard] },
                    { path: 'managers', component: ManagerComponent, data: { permission: 'Pages.Managers' }, canActivate: [AppRouteGuard] },
                    { path: 'report_one', component: ReportOneComponent, data: { permission: 'Pages.FloorDanceTypes' }, canActivate: [AppRouteGuard] },
                    { path: 'sub_business_element', component: SubComponent, data: { permission: 'Pages.SubBusinessElements' }, canActivate: [AppRouteGuard] },
                    { path: 'waitress', component: WaitressRevenuesComponent, data: { permission: 'Pages.WaitressRevenues' }, canActivate: [AppRouteGuard] },
                    { path: 'blank_forms', component: BlackFormComponent, data: { permission: 'Pages.DocumentsWhite' }, canActivate: [AppRouteGuard] },
                    { path: 'accounting', component: AccountingComponent, data: { permission: 'Pages.Accounting' }, canActivate: [AppRouteGuard] }
                    
                    
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
