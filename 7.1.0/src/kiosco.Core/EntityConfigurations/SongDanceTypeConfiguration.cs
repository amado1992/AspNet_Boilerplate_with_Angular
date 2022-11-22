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
    public class SongDanceTypeConfiguration : IEntityTypeConfiguration<SongDanceType>
    {
        public void Configure(EntityTypeBuilder<SongDanceType> builder)
        {
            /*builder
            .HasKey(fd => new { fd.DanceTypeId, fd.SongId });*/

            /*builder
            .HasKey(fd => new { fd.Id });*/

            builder
                .HasOne(dan => dan.DanceType)
                .WithMany(sd => sd.SongDanceTypes)
                .HasForeignKey(dan => dan.DanceTypeId);

            builder
                .HasOne(son => son.Song)
                .WithMany(sd => sd.SongDanceTypes)
                .HasForeignKey(son => son.SongId);

        }

    }
}
