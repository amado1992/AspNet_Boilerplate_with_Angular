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
    public class AccountingConfiguration : IEntityTypeConfiguration<AccountingPerShift>
    {
        public void Configure(EntityTypeBuilder<AccountingPerShift> builder)
        {
            builder
                   .HasOne(c => c.TypeBusinessElement)
                   .WithMany(b => b.AccountingPerShift)
                   .HasForeignKey(c => c.TypeBusinessElementId);

            builder
                .HasOne(j => j.Shift)
                .WithMany(s => s.AccountingPerShift)
                .HasForeignKey(j => j.ShiftId);

            builder
                .HasOne(j => j.WaitressRevenues)
                .WithMany(s => s.AccountingPerShift)
                .HasForeignKey(j => j.WaitressRevenuesId);
        }
    }
}
