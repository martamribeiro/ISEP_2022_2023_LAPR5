using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using GestaoArmazens.Domain.Armazens;

namespace GestaoArmazens.Infrastructure.Armazens
{
    internal class ArmazemEntityTypeConfiguration : IEntityTypeConfiguration<Armazem>
    {
        public void Configure(EntityTypeBuilder<Armazem> builder)
        {
            //builder.ToTable("Products", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            builder.OwnsOne(b => b.Morada, txt => 
            {
                txt.Property(a => a.Rua)
                .IsRequired();
                txt.Property(a=> a.NumeroPorta)
                .IsRequired();
                txt.Property(a=> a.CodigoPostal)
                .IsRequired();
                txt.Property(a=> a.Localidade)
                .IsRequired();
                txt.Property(a=> a.Pais)
                .IsRequired();
            });
            builder.OwnsOne(b => b.Coordenadas, txt =>
            {
                txt.Property(a => a.Latitude)
                .IsRequired();
                txt.Property(a=> a.Longitude)
                .IsRequired();
                txt.Property(a=> a.Altitude)
                .IsRequired();
            });
        }
    }
}