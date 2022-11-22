using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using kiosco.Authorization.Roles;
using kiosco.Authorization.Users;
using kiosco.MultiTenancy;
using kiosco.EntityConfigurations;
using kiosco.Entities;
using kiosco.Entities.Prices;

namespace kiosco.EntityFrameworkCore
{
    public class kioscoDbContext : AbpZeroDbContext<Tenant, Role, User, kioscoDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public kioscoDbContext(DbContextOptions<kioscoDbContext> options)
            : base(options)
        {
        }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<Job> Jobs { get; set; }
        //public DbSet<FloorWorker> FloorWorkers { get; set; }
        public DbSet<Entertainer> Entertainers { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<PriceShift> PriceShifts { get; set; }
        //public DbSet<Group> Groups { get; set; }
        //public DbSet<Key> Keys { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<DanceType> DanceTypes { get; set; }
        public DbSet<FloorDanceType> FloorDanceTypes { get; set; }
        public DbSet<ActivityToday> ActivityTodays { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<SongDanceType> SongDanceTypes { get; set; }
        public DbSet<DanceBase> DanceBases { get; set; }
        public DbSet<Document> Documents { get; set; }
        //public DbSet<HiredBy> Contractors { get; set; }
        public DbSet<Category> Categorys { get; set; }
        public DbSet<HiredStatu> HiredStatus { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<MainBusinessElement> MainBusinessElements { get; set; }
        public DbSet<SubBusinessElement> SubBusinessElements { get; set; }
        public DbSet<TypeBusinessElement> TypeBusinessElements { get; set; }
        public DbSet<WaitressRevenues> WaitressRevenues { get; set; }
        public DbSet<AccountingPerShift> Accounting { get; set; }
        public DbSet<DocumentWhite> DocumentsWhite { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new PriceShiftConfiguration());
            modelBuilder.ApplyConfiguration(new StaffConfiguration());
            modelBuilder.ApplyConfiguration(new EntertinerConfiguration());
            //modelBuilder.ApplyConfiguration(new KeyConfiguration());
            modelBuilder.ApplyConfiguration(new FloorDanceTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SongDanceTypeConfiguration());
            modelBuilder.ApplyConfiguration(new DocumentConfiguration());
            modelBuilder.ApplyConfiguration(new ManagerConfiguration());
            modelBuilder.ApplyConfiguration(new SubBusinessElementConfiguration());
            modelBuilder.ApplyConfiguration(new TypeBusinessElementConfiguration());
            modelBuilder.ApplyConfiguration(new MainBusinessElementConfiguration());
            modelBuilder.ApplyConfiguration(new WaitressRevenuesConfiguration());
            modelBuilder.ApplyConfiguration(new AccountingConfiguration());
        }
    }
}
