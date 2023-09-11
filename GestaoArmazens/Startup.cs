using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using GestaoArmazens.Infrastructure;
using GestaoArmazens.Infrastructure.Armazens;
using GestaoArmazens.Infrastructure.Entregas;
using GestaoArmazens.Infrastructure.Shared;
using GestaoArmazens.Domain.Shared;
using GestaoArmazens.Domain.Armazens;
using GestaoArmazens.Domain.Entregas;
using Pomelo.EntityFrameworkCore.MySql;
using Pomelo.EntityFrameworkCore.MySql.Design;


namespace GestaoArmazens
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            /*services.AddDbContext<DDDSample1DbContext>(opt =>
                opt.UseInMemoryDatabase("DDDSample1DB")
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());*/

            services.AddDbContext<MySQLContext>(opt =>
                opt.UseMySql(Configuration.GetConnectionString("DefaultConnection"), ServerVersion.AutoDetect(Configuration.GetConnectionString("DefaultConnection")))
                .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());
            ConfigureMyServices(services);

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                        policy =>
                                {
                                    policy.WithOrigins("http://localhost:3000")
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                                     policy.WithOrigins("https://localhost:3000")
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                                    policy.WithOrigins("http://vs258.dei.isep.ipp.pt")
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                                    policy.WithOrigins("http://localhost:3001")
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                                     policy.WithOrigins("https://localhost:3001")
                                     .AllowAnyHeader()
                                     .AllowAnyMethod();
                                });
            });
            

            services.AddControllers().AddNewtonsoftJson();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        public void ConfigureMyServices(IServiceCollection services)
        {
            services.AddTransient<IUnitOfWork,UnitOfWork>();

            /*services.AddTransient<ICategoryRepository,CategoryRepository>();
            services.AddTransient<CategoryService>();

            services.AddTransient<IProductRepository,ProductRepository>();
            services.AddTransient<ProductService>();

            services.AddTransient<IFamilyRepository,FamilyRepository>();
            services.AddTransient<FamilyService>();*/

            services.AddTransient<IArmazemRepository,ArmazemRepository>();
            services.AddTransient<IArmazemService,ArmazemService>();

            services.AddTransient<IEntregaRepository,EntregaRepository>();
            services.AddTransient<IEntregaService,EntregaService>();


        }
    }
}
