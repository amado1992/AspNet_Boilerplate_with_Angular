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
    public class TypeBusinessElementConfiguration : IEntityTypeConfiguration<TypeBusinessElement>
    {
        public void Configure(EntityTypeBuilder<TypeBusinessElement> builder)
        {
            builder
                   .HasOne(ma => ma.MainBusinessElement)
                   .WithMany(b => b.TypeBusinessElements)
                   .HasForeignKey(ma => ma.MainBusinessElementId);
            builder
                   .HasOne(sub => sub.SubBusinessElement)
                   .WithMany(b => b.TypeBusinessElements)
                   .HasForeignKey(ma => ma.SubBusinessElementId);
        }
    }
}
