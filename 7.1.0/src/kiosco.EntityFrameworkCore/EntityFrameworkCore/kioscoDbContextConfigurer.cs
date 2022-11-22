using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace kiosco.EntityFrameworkCore
{
    public static class kioscoDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<kioscoDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<kioscoDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
