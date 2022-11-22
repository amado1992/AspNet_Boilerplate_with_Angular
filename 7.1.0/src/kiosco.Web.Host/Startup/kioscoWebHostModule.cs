using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using kiosco.Configuration;

namespace kiosco.Web.Host.Startup
{
    [DependsOn(
       typeof(kioscoWebCoreModule))]
    public class kioscoWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public kioscoWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(kioscoWebHostModule).GetAssembly());
        }
    }
}
