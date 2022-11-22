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
    public class WaitressRevenuesConfiguration : IEntityTypeConfiguration<WaitressRevenues>
    {
        public void Configure(EntityTypeBuilder<WaitressRevenues> builder)
        {
                builder
                   .HasOne(ma => ma.MainBusinessElement)
                   .WithMany(b => b.WaitressRevenues)
                   .HasForeignKey(ma => ma.MainBusinessElementId);
        }
    }
}
