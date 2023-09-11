using Microsoft.EntityFrameworkCore;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Domain.Entregas;
using GestaoArmazens.Infrastructure.Armazens;
using GestaoArmazens.Infrastructure.Entregas;

namespace GestaoArmazens.Infrastructure
{
    public class MySQLContext : DbContext
    {
        

        public virtual DbSet<Armazem> Armazens { get; set; }

        public DbSet<Entrega> Entregas { get; set; }

        public string ConnectionString { get; set; }

        public MySQLContext(DbContextOptions<MySQLContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyEntityTypeConfiguration());*/
            modelBuilder.ApplyConfiguration(new ArmazemEntityTypeConfiguration());
            
            modelBuilder.ApplyConfiguration(new EntregaEntityTypeConfiguration());
            
            
            //modelBuilder.Entity<Armazem>().Ignore(s => s.Id);
            

        }
    }
}