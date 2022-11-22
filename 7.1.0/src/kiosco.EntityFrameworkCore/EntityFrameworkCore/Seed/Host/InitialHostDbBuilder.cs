
namespace kiosco.EntityFrameworkCore.Seed.Host
{
    public class InitialHostDbBuilder
    {
        private readonly kioscoDbContext _context;

        public InitialHostDbBuilder(kioscoDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new HostRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();
            new DeafaultSongCreator(_context).Create();
            new DefaultDanceTypeCreator(_context).Create();
            //new DefaultShiftCreator(_context).Create();
            //new DefaultSongDanceTypeCreator(_context).Create();
            new DefaultDanceBaseCreator(_context).Create();
            new DefaultCategoryCreator(_context).Create();
            new DefaultHiredStatuCreator(_context).Create();

            new DefaultSectionCreator(_context).Create();
            new DefaultWaitressRevenuesCreator(_context).Create();
            new DefaultMainBusinessElementCreator(_context).Create();
            new DefaultSubBusinessElementCreator(_context).Create();
            new DefaultTypeBusinessElementCreator(_context).Create();

            _context.SaveChanges();
        }
    }
}
