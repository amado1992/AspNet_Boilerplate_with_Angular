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
    public class MainBusinessElementConfiguration : IEntityTypeConfiguration<MainBusinessElement>
    {
        public void Configure(EntityTypeBuilder<MainBusinessElement> builder)
        {
                 builder
                   .HasOne(se => se.Section)
                   .WithMany(b => b.MainBusinessElements)
                   .HasForeignKey(se => se.SectionId);
        }
    }
}
