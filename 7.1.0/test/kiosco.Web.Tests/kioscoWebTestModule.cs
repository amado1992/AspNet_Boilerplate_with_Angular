using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using kiosco.EntityFrameworkCore;
using kiosco.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace kiosco.Web.Tests
{
    [DependsOn(
        typeof(kioscoWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class kioscoWebTestModule : AbpModule
    {
        public kioscoWebTestModule(kioscoEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(kioscoWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(kioscoWebMvcModule).Assembly);
        }
    }
}