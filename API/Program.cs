using API.Data;
using API.Dtos;
using API.Entities;
using API.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Builder; 
using Microsoft.Extensions.DependencyInjection; 


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<ICompanyService<CompanyDto>, CompanyService>();
builder.Services.AddScoped<IEmployeeService<EmployeeDto>, EmployeeService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(opt => {
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});


app.UseAuthorization();

app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    context.Database.Migrate();
    DbInitializer.Initialize(context);
    DbEmployeeInitializer.Initialize(context); 
}
catch (Exception ex)
{
    
    logger.LogError(ex, "A problem occured during migrations");
}


app.Run();
