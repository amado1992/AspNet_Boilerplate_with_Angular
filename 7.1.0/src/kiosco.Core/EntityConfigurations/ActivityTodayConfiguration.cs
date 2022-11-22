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
    public class ActivityTodayConfiguration : IEntityTypeConfiguration<ActivityToday>
    {
        public void Configure(EntityTypeBuilder<ActivityToday> builder)
        {
            builder
                   .HasOne(en => en.Entertainer)
                   .WithMany(b => b.ActivityTodays)
                   .HasForeignKey(en => en.EntertainerId);
        }
    }
}
