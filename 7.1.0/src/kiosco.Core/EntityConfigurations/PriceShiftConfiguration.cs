
using kiosco.Entities.Prices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace kiosco.EntityConfigurations
{
    public class PriceShiftConfiguration : IEntityTypeConfiguration<PriceShift>
    {
        public void Configure(EntityTypeBuilder<PriceShift> builder)
        {
            /*builder
            .HasKey(ps => new { ps.Id_Key, ps.Id_Shift});*/

            builder
                //.HasOne(key => key.key)
                .HasOne(key => key.TypeBusinessElement)
                .WithMany(key => key.PriceShifts)
                .HasForeignKey(key => key.TypeBusinessElementId);
               //.HasForeignKey(key => key.KeyId);

            builder
                .HasOne(sh => sh.Shift)
                .WithMany(sh => sh.PriceShifts)
                .HasForeignKey(sh => sh.ShiftId);
        }
    }
}
