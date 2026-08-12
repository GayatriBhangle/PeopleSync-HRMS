using Microsoft.EntityFrameworkCore;
using Payment_module.Data;
using Payment_module.Respositories;
using Payment_module.Services;
using System.Text.Json.Serialization;


namespace Payment_module
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // NOTE: System.Text.Json serializes enums as numbers by default,
            // but the Spring Boot side (Jackson) expects enum *names* like
            // "SUCCESS" when deserializing PaymentResponseDTO.status.
            // Without this converter, every call from Spring Boot would
            // fail with a JSON mapping error.
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter());
                });

            //builder.Services.AddControllersWithViews();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<PaymentDbContextClass>(options =>
                                                                        options.UseMySql(
                                                                            builder.Configuration.GetConnectionString("DefaultConnection"),
                                                                            ServerVersion.AutoDetect(
                                                                                builder.Configuration.GetConnectionString("DefaultConnection"))));

            builder.Services.AddScoped<IPaymentRepostitory, PaymentRespository>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddAuthorization();

            builder.Services.AddScoped<IPaymentRepostitory, PaymentRespository>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("FrontendPolicy", policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            //app.UseAuthorization();

            app.UseCors("FrontendPolicy");

            app.MapControllers();
            app.Run();
        }
    }
}
