using kiosco.Entities.Prices;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace kiosco.EntityConfigurations
{
    public class KeyConfiguration : IEntityTypeConfiguration<Key>
    {
        public void Configure(EntityTypeBuilder<Key> builder)
        {
            builder
            .HasOne(k => k.Group)
            .WithMany(k => k.Keys)
            .HasForeignKey(k => k.GroupId).IsRequired();
        }
    }
}
