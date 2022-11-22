using Abp.Authorization;
using kiosco.Authorization.Roles;
using kiosco.Authorization.Users;

namespace kiosco.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
