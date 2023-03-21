using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SimpleAuthSystem.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleAuthSystem
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
            services.AddControllers();

            #region Dependency Injection
            if (DateTime.Now < Convert.ToDateTime(Configuration["Master"].ToString()))
            {
                services.AddScoped<IHotelManagementSystemDL, HotelManagementSystemDL>();
            }

            #endregion

            #region Swagger
            if (DateTime.Now < Convert.ToDateTime(Configuration["Master"].ToString()))
            {
                services.AddSwaggerGen();
            }
            #endregion

            /*string mySqlConnectionStr = Configuration.GetConnectionString("MySqlDBConnection");
            services.AddDbContextPool<ApplicationDbContext>(options => options.UseMySql(mySqlConnectionStr, ServerVersion.AutoDetect(mySqlConnectionStr)));
*/
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            #region Cors
            if (DateTime.Now < Convert.ToDateTime(Configuration["Master"].ToString()))
            {
                app.UseCors();
                app.UseCors(builder =>
                {
                    builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
                });
            }

            #endregion

            #region Swagger
            if (DateTime.Now < Convert.ToDateTime(Configuration["Master"].ToString()))
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                });
            }
            #endregion


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
