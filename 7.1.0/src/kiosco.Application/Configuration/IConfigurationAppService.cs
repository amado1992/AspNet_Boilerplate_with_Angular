using System.Threading.Tasks;
using kiosco.Configuration.Dto;

namespace kiosco.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
