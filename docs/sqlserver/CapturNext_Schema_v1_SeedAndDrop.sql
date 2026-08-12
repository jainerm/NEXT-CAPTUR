-- CapturNext SQL Server schema v1 seed and rollback script
-- Inserta datos semilla para catálogos y ofrece un rollback básico.

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- 1. Seed de catálogos
INSERT INTO [capturnext].[CatalogAssetState] ([Id],[Code],[Name],[Description],[IsActive]) VALUES
(1,'Pending','Pending','Activo pendiente de revisión',1),
(2,'Active','Active','Activo operativo',1),
(3,'Missing','Missing','Activo reportado como faltante',1),
(4,'Damaged','Damaged','Activo con daño',1),
(5,'Retired','Retired','Activo dado de baja',1);
GO

INSERT INTO [capturnext].[CatalogLocationType] ([Id],[Code],[Name],[Description],[IsActive]) VALUES
(1,'Headquarter','Headquarter','Sede principal',1),
(2,'Branch','Branch','Sucursal o filial',1),
(3,'Warehouse','Warehouse','Bodega o almacén',1),
(4,'Office','Office','Oficina',1),
(5,'Other','Other','Otra ubicación',1);
GO

INSERT INTO [capturnext].[CatalogAssetType] ([Id],[Code],[Name],[Description],[IsActive]) VALUES
(1,'Computer','Computer','Equipo de cómputo',1),
(2,'Furniture','Furniture','Mobiliario',1),
(3,'Vehicle','Vehicle','Vehículo',1),
(4,'Equipment','Equipment','Equipo especializado',1),
(5,'Other','Other','Otro tipo de activo',1);
GO

INSERT INTO [capturnext].[CatalogMovementType] ([Id],[Code],[Name],[Description],[IsActive]) VALUES
(1,'Transfer','Transfer','Transferencia de ubicación o responsable',1),
(2,'StateChange','StateChange','Cambio de estado del activo',1),
(3,'Adjustment','Adjustment','Ajuste de inventario',1),
(4,'WriteOff','WriteOff','Baja o desincorporación',1);
GO

INSERT INTO [capturnext].[CatalogDeletionReason] ([Id],[Code],[Name],[Description],[IsActive]) VALUES
(1,'Retired','Retired','Activo dado de baja lógica',1),
(2,'Lost','Lost','Activo perdido',1),
(3,'DamagedBeyondRepair','DamagedBeyondRepair','Activo dañado irreparable',1),
(4,'Stolen','Stolen','Activo robado',1);
GO

-- 2. Rollback / Drop schema
-- Ejecute este bloque con cuidado en entornos de desarrollo solo si desea eliminar el esquema completo.
-- El orden respeta dependencias entre tablas.

-- DROP VIEW
IF OBJECT_ID('[capturnext].[vw_ActiveAssets]', 'V') IS NOT NULL
    DROP VIEW [capturnext].[vw_ActiveAssets];
GO

-- DROP TRIGGERS
IF OBJECT_ID('[capturnext].[TRG_Assets_UpdateTimestamp]', 'TR') IS NOT NULL
    DROP TRIGGER [capturnext].[TRG_Assets_UpdateTimestamp];
GO
IF OBJECT_ID('[capturnext].[TRG_Locations_UpdateTimestamp]', 'TR') IS NOT NULL
    DROP TRIGGER [capturnext].[TRG_Locations_UpdateTimestamp];
GO
IF OBJECT_ID('[capturnext].[TRG_Responsibles_UpdateTimestamp]', 'TR') IS NOT NULL
    DROP TRIGGER [capturnext].[TRG_Responsibles_UpdateTimestamp];
GO
IF OBJECT_ID('[capturnext].[TRG_Organizations_UpdateTimestamp]', 'TR') IS NOT NULL
    DROP TRIGGER [capturnext].[TRG_Organizations_UpdateTimestamp];
GO

-- DROP TABLES en orden inverso de dependencias
IF OBJECT_ID('[capturnext].[SyncOperations]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[SyncOperations];
GO
IF OBJECT_ID('[capturnext].[AuditEvents]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[AuditEvents];
GO
IF OBJECT_ID('[capturnext].[AssetMovements]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[AssetMovements];
GO
IF OBJECT_ID('[capturnext].[AssetPhotos]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[AssetPhotos];
GO
IF OBJECT_ID('[capturnext].[Assets]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[Assets];
GO
IF OBJECT_ID('[capturnext].[Responsibles]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[Responsibles];
GO
IF OBJECT_ID('[capturnext].[Locations]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[Locations];
GO
IF OBJECT_ID('[capturnext].[RefreshTokens]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[RefreshTokens];
GO
IF OBJECT_ID('[capturnext].[Users]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[Users];
GO
IF OBJECT_ID('[capturnext].[Organizations]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[Organizations];
GO

-- DROP CATÁLOGOS
IF OBJECT_ID('[capturnext].[CatalogDeletionReason]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[CatalogDeletionReason];
GO
IF OBJECT_ID('[capturnext].[CatalogMovementType]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[CatalogMovementType];
GO
IF OBJECT_ID('[capturnext].[CatalogAssetType]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[CatalogAssetType];
GO
IF OBJECT_ID('[capturnext].[CatalogLocationType]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[CatalogLocationType];
GO
IF OBJECT_ID('[capturnext].[CatalogAssetState]', 'U') IS NOT NULL
    DROP TABLE [capturnext].[CatalogAssetState];
GO

-- DROP SCHEMA
IF EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'capturnext')
BEGIN
    DROP SCHEMA [capturnext];
END;
GO
