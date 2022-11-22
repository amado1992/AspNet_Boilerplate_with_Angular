﻿using kiosco.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kiosco.EntityConfigurations
{
    public class SubBusinessElementConfiguration : IEntityTypeConfiguration<SubBusinessElement>
    {
        public void Configure(EntityTypeBuilder<SubBusinessElement> builder)
        {
            builder
                   .HasOne(ma => ma.MainBusinessElement)
                   .WithMany(b => b.SubBusinessElements)
                   .HasForeignKey(ma => ma.MainBusinessElementId);
        }
    }
}
