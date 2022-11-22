using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityConfigurations
{
    public class ManagerConfiguration : IEntityTypeConfiguration<Manager>
    {
        public void Configure(EntityTypeBuilder<Manager> builder)
        {
            builder
                   .HasOne(c => c.Club)
                   .WithMany(b => b.Managers)
                   .HasForeignKey(c => c.ClubId);

            builder
                .HasOne(j => j.Job)
                .WithMany(b => b.Managers)
                .HasForeignKey(j => j.JobId);

            builder
                .HasOne(h => h.Category)
                .WithMany(b => b.Managers)
                .HasForeignKey(h => h.CategoryId);
        }
    }
}
