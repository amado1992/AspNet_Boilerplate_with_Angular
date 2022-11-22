using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using kiosco.Configuration.Dto;

namespace kiosco.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : kioscoAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
