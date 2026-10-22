using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MatchUp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    Zone = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PricePerHour = table.Column<decimal>(type: "numeric", nullable: false),
                    SportsType = table.Column<string>(type: "text", nullable: false),
                    HasLighting = table.Column<bool>(type: "boolean", nullable: false),
                    HasChangingRooms = table.Column<bool>(type: "boolean", nullable: false),
                    HasParking = table.Column<bool>(type: "boolean", nullable: false),
                    IsCovered = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fields_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fields_OwnerId",
                table: "Fields",
                column: "OwnerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fields");
        }
    }
}
