using System.Threading.Tasks;
using kiosco.Models.TokenAuth;
using kiosco.Web.Controllers;
using Shouldly;
using Xunit;

namespace kiosco.Web.Tests.Controllers
{
    public class HomeController_Tests: kioscoWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}