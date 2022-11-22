using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;

namespace kiosco.Authorization
{
    public class kioscoAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);

            context.CreatePermission(PermissionNames.Pages_Clubs, L("Clubs"));
            context.CreatePermission(PermissionNames.Pages_Jobs, L("Jobs"));
            context.CreatePermission(PermissionNames.Pages_FloorWorkers, L("FloorWorkers"));
            context.CreatePermission(PermissionNames.Pages_Entertainers, L("Entertainers"));
            context.CreatePermission(PermissionNames.Pages_Shifts, L("Shifts"));
            context.CreatePermission(PermissionNames.Pages_PriceShifts, L("Schedules"));
            context.CreatePermission(PermissionNames.Pages_Keys, L("Schedule restrictions"));
            context.CreatePermission(PermissionNames.Pages_Groups, L("Groups"));
            context.CreatePermission(PermissionNames.Pages_FloorDanceTypes, L("Today's business"));
            context.CreatePermission(PermissionNames.Pages_ActivityTodays, L("Lineup"));
            context.CreatePermission(PermissionNames.Pages_DanceTypes, L("DanceTypes"));
            context.CreatePermission(PermissionNames.Pages_Songs, L("Songs"));
            context.CreatePermission(PermissionNames.Pages_SongDanceTypes, L("Dancing to songs"));
            context.CreatePermission(PermissionNames.Pages_Documents, L("Documents"));
            context.CreatePermission(PermissionNames.Pages_Contractors, L("Contractors"));
            context.CreatePermission(PermissionNames.Pages_Categorys, L("Categorys"));
            context.CreatePermission(PermissionNames.Pages_HiredStatus, L("HiredStatus"));
            context.CreatePermission(PermissionNames.Pages_Managers, L("Managers"));
            context.CreatePermission(PermissionNames.Pages_MainBusinessElements, L("Main business element"));
            context.CreatePermission(PermissionNames.Pages_SubBusinessElements, L("Secundary business element"));
            context.CreatePermission(PermissionNames.Pages_TypeBusinessElements, L("Type business element"));
            context.CreatePermission(PermissionNames.Pages_Sections, L("Sections"));
            context.CreatePermission(PermissionNames.Pages_WaitressRevenues, L("Waitress revenues"));
            context.CreatePermission(PermissionNames.Pages_Accounting, L("Accounting"));
            context.CreatePermission(PermissionNames.Pages_DocumentsWhite, L("Document in white"));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, kioscoConsts.LocalizationSourceName);
        }
    }
}
