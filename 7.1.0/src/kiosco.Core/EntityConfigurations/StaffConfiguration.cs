using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace kiosco.EntityConfigurations
{
    public class StaffConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {

            #region Staff
            builder
            .HasOne(c => c.Job)
            .WithMany(b => b.Staffs)
            .HasForeignKey(f => f.JobId).IsRequired();
            #endregion
        }

    }
}
