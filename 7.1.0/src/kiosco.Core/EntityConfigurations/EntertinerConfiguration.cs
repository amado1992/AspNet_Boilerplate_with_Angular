using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace kiosco.EntityConfigurations
{
    public class EntertinerConfiguration : IEntityTypeConfiguration<Entertainer>
    {

        public void Configure(EntityTypeBuilder<Entertainer> builder)
        {
            builder
                   .HasOne(c => c.Club)
                   .WithMany(b => b.Entertainers)
                   .HasForeignKey(c => c.ClubId);
            
            builder
                .HasOne(j => j.Job)
                .WithMany(b => b.Entertainers)
                .HasForeignKey(j => j.JobId);
            
            builder
                .HasOne(h => h.HiredBy)
                .WithMany(b => b.HiredByEntertainers)
                .HasForeignKey(h => h.HiredById);

            builder
                .HasOne(h => h.Category)
                .WithMany(b => b.Entertainers)
                .HasForeignKey(h => h.CategoryId);

            builder
                .HasOne(h => h.NoHiredBy)
                .WithMany(b => b.NoHiredByEntertainers)
                .HasForeignKey(h => h.NoHiredById);

            builder
                .HasOne(h => h.HiredStatu)
                .WithMany(b => b.Entertainers)
                .HasForeignKey(h => h.HiredStatuId);
        }
    }
}
