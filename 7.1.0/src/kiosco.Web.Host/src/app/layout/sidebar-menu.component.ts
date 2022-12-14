import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '@shared/app-component-base';
import {
    Router,
    RouterEvent,
    NavigationEnd,
    PRIMARY_OUTLET
} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MenuItem} from '@shared/layout/menu-item';

@Component({
    selector: 'sidebar-menu',
    templateUrl: './sidebar-menu.component.html'
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
    menuItems: MenuItem[];
    menuItemsMap: { [key: number]: MenuItem } = {};
    activatedMenuItems: MenuItem[] = [];
    routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
    homeRoute = '/app/about';

    constructor(injector: Injector, private router: Router) {
        super(injector);
        this.router.events.subscribe(this.routerEvents);
    }

    ngOnInit(): void {
        this.menuItems = this.getMenuItems();
        this.patchMenuItems(this.menuItems);
        this.routerEvents
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
                const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
                const primaryUrlSegmentGroup = this.router.parseUrl(currentUrl).root
                    .children[PRIMARY_OUTLET];
                if (primaryUrlSegmentGroup) {
                    this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
                }
            });
    }

    getMenuItems(): MenuItem[] {
        return [
            //new MenuItem(this.l('About'), '/app/about', 'fas fa-info-circle'),
            new MenuItem(this.l('HomePage'), '/app/home', 'fas fa-home'),
            new MenuItem(
                this.l('Roles'),
                '/app/roles',
                'fas fa-theater-masks',
                'Pages.Roles'
            ),
            /*new MenuItem(
                this.l('Tenants'),
                '/app/tenants',
                'fas fa-building',
                'Pages.Tenants'
            ),*/
            new MenuItem(
                this.l('Users'),
                '/app/users',
                'fas fa-users',
                'Pages.Users'
            ),
            /*new MenuItem(this.l('MultiLevelMenu'), '', 'fas fa-circle', '', [
                new MenuItem('ASP.NET Boilerplate', '', 'fas fa-dot-circle', '', [
                    new MenuItem(
                        'Home',
                        'https://aspnetboilerplate.com?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Templates',
                        'https://aspnetboilerplate.com/Templates?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Samples',
                        'https://aspnetboilerplate.com/Samples?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Documents',
                        'https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl',
                        'far fa-circle'
                    ),
                ]),
                new MenuItem('ASP.NET Zero', '', 'fas fa-dot-circle', '', [
                    new MenuItem(
                        'Home',
                        'https://aspnetzero.com?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Features',
                        'https://aspnetzero.com/Features?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Pricing',
                        'https://aspnetzero.com/Pricing?ref=abptmpl#pricing',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Faq',
                        'https://aspnetzero.com/Faq?ref=abptmpl',
                        'far fa-circle'
                    ),
                    new MenuItem(
                        'Documents',
                        'https://aspnetzero.com/Documents?ref=abptmpl',
                        'far fa-circle'
                    )
                ])
            ])*/
            new MenuItem(
                this.l('Floor walker board'),
                '/app/floor_worker_borad',
                'fas fa-business-time',
                'Pages.FloorDanceTypes'
            ),
            
            new MenuItem(
                this.l('Manage todays business'),
                '/app/floor_danceTypes',
                'fas fa-comment-dollar',
                'Pages.FloorDanceTypes'
            ),
            new MenuItem(
                this.l('Accounting'),
                '/app/accounting',
                'fas fa-hand-holding-usd',
                'Pages.Accounting'
            ),
            new MenuItem(
                this.l('Report'),
                '/app/report_one',
                'fas fa-chart-line',
                'Pages.FloorDanceTypes'
            ),
            new MenuItem(
                this.l('Blank forms'),
                '/app/blank_forms',
                'fas fa-file-pdf',
                'Pages.DocumentsWhite'
            ),
            new MenuItem(this.l('Nomenclator'), '', 'fas fa-circle', '', [
                new MenuItem(
                    this.l('Clubs'),
                    '/app/clubs',
                    'fas fa-cocktail',
                    'Pages.Clubs'
                ),
                
                new MenuItem(
                    this.l('Jobs'),
                    '/app/jobs',
                    'fas fa-user',
                    'Pages.Jobs'
                ),
                new MenuItem(
                    this.l('Managers'),
                    '/app/managers',
                    'fas fa-user-tie',
                    'Pages.Managers'
                ),
                new MenuItem(
                    this.l('Shifts'),
                    '/app/shifts',
                    'fas fa-calendar-alt',
                    'Pages.Shifts'
                ),
                new MenuItem(
                    this.l('Main business element'),
                    '/app/groups',
                    'fas fa-donate',
                    'Pages.MainBusinessElements'
                ),
                new MenuItem(
                    this.l('Secundary business element'),
                    '/app/sub_business_element',
                    'fas fa-file-invoice-dollar',
                    'Pages.SubBusinessElements'
                ),
                new MenuItem(
                    this.l('Type business element'),
                    '/app/keys',
                    'fas fa-tasks',
                    'Pages.TypeBusinessElements'
                ),
                new MenuItem(
                    this.l('Waitress revenues'),
                    '/app/waitress',
                    'fas fa-money-check-alt',
                    'Pages.WaitressRevenues'
                ),
                new MenuItem(
                    this.l('Prices schedules'),
                    '/app/schedules',
                    'fas fa-calendar-check',
                    'Pages.PriceShifts'
                ),
                new MenuItem(
                    this.l('DanceTypes'),
                    '/app/danceTypes',
                    'fas fa-music',
                    'Pages.DanceTypes'
                ),
                new MenuItem(
                    this.l('Songs'),
                    '/app/songs',
                    'fas fa-music',
                    'Pages.Songs'
                ),
                new MenuItem(
                    this.l('Dancing to songs'),
                    '/app/song_dancetypes',
                    'fas fa-music',
                    'Pages.SongDanceTypes'
                ),
                new MenuItem(
                    this.l('Entertainers'),
                    '/app/entertainers',
                    'fas fa-user-circle',
                    'Pages.Entertainers'
                ),
                new MenuItem(
                    this.l('ActivityTodays'),
                    '/app/lineup',
                    'far fa-id-badge',
                    'Pages.ActivityTodays'
                )
            ])
        ];
    }

    patchMenuItems(items: MenuItem[], parentId?: number): void {
        items.forEach((item: MenuItem, index: number) => {
            item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
            if (parentId) {
                item.parentId = parentId;
            }
            if (parentId || item.children) {
                this.menuItemsMap[item.id] = item;
            }
            if (item.children) {
                this.patchMenuItems(item.children, item.id);
            }
        });
    }

    activateMenuItems(url: string): void {
        this.deactivateMenuItems(this.menuItems);
        this.activatedMenuItems = [];
        const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
        foundedItems.forEach((item) => {
            this.activateMenuItem(item);
        });
    }

    deactivateMenuItems(items: MenuItem[]): void {
        items.forEach((item: MenuItem) => {
            item.isActive = false;
            item.isCollapsed = true;
            if (item.children) {
                this.deactivateMenuItems(item.children);
            }
        });
    }

    findMenuItemsByUrl(
        url: string,
        items: MenuItem[],
        foundedItems: MenuItem[] = []
    ): MenuItem[] {
        items.forEach((item: MenuItem) => {
            if (item.route === url) {
                foundedItems.push(item);
            } else if (item.children) {
                this.findMenuItemsByUrl(url, item.children, foundedItems);
            }
        });
        return foundedItems;
    }

    activateMenuItem(item: MenuItem): void {
        item.isActive = true;
        if (item.children) {
            item.isCollapsed = false;
        }
        this.activatedMenuItems.push(item);
        if (item.parentId) {
            this.activateMenuItem(this.menuItemsMap[item.parentId]);
        }
    }

    isMenuItemVisible(item: MenuItem): boolean {
        if (!item.permissionName) {
            return true;
        }
        return this.permission.isGranted(item.permissionName);
    }
}
