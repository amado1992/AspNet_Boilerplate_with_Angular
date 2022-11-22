using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace kiosco.Controllers
{
    public abstract class kioscoControllerBase: AbpController
    {
        protected kioscoControllerBase()
        {
            LocalizationSourceName = kioscoConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
