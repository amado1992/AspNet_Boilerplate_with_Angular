using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using kiosco.Authorization;

namespace kiosco
{
    [DependsOn(
        typeof(kioscoCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class kioscoApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<kioscoAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(kioscoApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
