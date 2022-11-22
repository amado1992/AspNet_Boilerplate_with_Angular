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
    public class FloorDanceTypeConfiguration : IEntityTypeConfiguration<FloorDanceType>
    {
        public void Configure(EntityTypeBuilder<FloorDanceType> builder)
        {
            /*builder
            .HasKey(fd => new { fd.Id_Key, fd.Id_Shift, fd.DanceTypeId});*/

            builder
                .HasOne(key => key.key)
                .WithMany(key => key.FloorDanceTypes)
                .HasForeignKey(key => key.KeyId);

            builder
                .HasOne(sh => sh.Shift)
                .WithMany(sh => sh.FloorDanceTypes)
                .HasForeignKey(sh => sh.ShiftId);

            builder
                .HasOne(sh => sh.DanceType)
                .WithMany(sh => sh.FloorDanceTypes)
                .HasForeignKey(sh => sh.DanceTypeId);

            builder
                .HasOne(act => act.ActivityToday)
                .WithMany(fl => fl.FloorDanceTypes)
                .HasForeignKey(act => act.ActivityTodayId);

        }
    }
}
