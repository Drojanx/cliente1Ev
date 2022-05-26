using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Category> Categories { get; set; }
        
        public DbSet<Site> Sites { get; set; }
    }
}