-- CapturNext SQL Server schema v1
-- Diseño físico para SQL Server de acuerdo al plan de arquitectura de datos y API.
-- Incluye tablas principales, catálogos, constraints, índices y baja lógica.

CREATE DATABASE captur_next;
GO

USE captur_next;
GO


SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

-- 1. Esquema base
CREATE SCHEMA [capturnext];
GO

-- 2. Tipos y catálogos
CREATE TABLE [capturnext].[CatalogAssetState](
    [Id] TINYINT NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(32) NOT NULL UNIQUE,
    [Name] NVARCHAR(64) NOT NULL,
    [Description] NVARCHAR(256) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_CatalogAssetState_IsActive] DEFAULT(1)
);
GO

CREATE TABLE [capturnext].[CatalogLocationType](
    [Id] TINYINT NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(32) NOT NULL UNIQUE,
    [Name] NVARCHAR(64) NOT NULL,
    [Description] NVARCHAR(256) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_CatalogLocationType_IsActive] DEFAULT(1)
);
GO

CREATE TABLE [capturnext].[CatalogAssetType](
    [Id] TINYINT NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(32) NOT NULL UNIQUE,
    [Name] NVARCHAR(64) NOT NULL,
    [Description] NVARCHAR(256) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_CatalogAssetType_IsActive] DEFAULT(1)
);
GO

CREATE TABLE [capturnext].[CatalogMovementType](
    [Id] TINYINT NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(32) NOT NULL UNIQUE,
    [Name] NVARCHAR(64) NOT NULL,
    [Description] NVARCHAR(256) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_CatalogMovementType_IsActive] DEFAULT(1)
);
GO

CREATE TABLE [capturnext].[CatalogDeletionReason](
    [Id] TINYINT NOT NULL PRIMARY KEY,
    [Code] NVARCHAR(32) NOT NULL UNIQUE,
    [Name] NVARCHAR(64) NOT NULL,
    [Description] NVARCHAR(256) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_CatalogDeletionReason_IsActive] DEFAULT(1)
);
GO

CREATE TABLE [capturnext].[Organizations](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Code] NVARCHAR(50) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_Organizations_IsActive] DEFAULT(1),
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Organizations_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Organizations_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL
);
GO

CREATE UNIQUE INDEX [IX_Organizations_Code] ON [capturnext].[Organizations]([Code]) WHERE [IsActive] = 1;
GO

CREATE TABLE [capturnext].[Users](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [UserName] NVARCHAR(120) NOT NULL,
    [DisplayName] NVARCHAR(200) NOT NULL,
    [Email] NVARCHAR(320) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_Users_IsActive] DEFAULT(1),
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Users_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Users_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_Users_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
GO

CREATE UNIQUE INDEX [IX_Users_OrganizationId_UserName] ON [capturnext].[Users]([OrganizationId],[UserName]) WHERE [IsActive] = 1;
GO

CREATE TABLE [capturnext].[RefreshTokens](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [TokenHash] NVARCHAR(256) NOT NULL,
    [ExpiresAtUtc] DATETIME2(3) NOT NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_RefreshTokens_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [RevokedAtUtc] DATETIME2(3) NULL,
    [ReplacedByToken] UNIQUEIDENTIFIER NULL,
    [RemoteIpAddress] NVARCHAR(45) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_RefreshTokens_IsActive] DEFAULT(1),
    CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY([UserId]) REFERENCES [capturnext].[Users]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION
);
GO

CREATE INDEX [IX_RefreshTokens_UserId] ON [capturnext].[RefreshTokens]([UserId]);
GO

CREATE TABLE [capturnext].[Locations](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [ParentLocationId] UNIQUEIDENTIFIER NULL,
    [LocationTypeId] TINYINT NOT NULL,
    [Code] NVARCHAR(100) NOT NULL,
    [Name] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(500) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_Locations_IsActive] DEFAULT(1),
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Locations_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Locations_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_Locations_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Locations_ParentLocation] FOREIGN KEY([ParentLocationId]) REFERENCES [capturnext].[Locations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Locations_CatalogLocationType] FOREIGN KEY([LocationTypeId]) REFERENCES [capturnext].[CatalogLocationType]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [CK_Locations_ParentLocationId_NotSelf] CHECK ([ParentLocationId] IS NULL OR [ParentLocationId] <> [Id])
);
GO

CREATE UNIQUE INDEX [IX_Locations_OrganizationId_Code] ON [capturnext].[Locations]([OrganizationId],[Code]) WHERE [IsActive] = 1;
GO

CREATE TABLE [capturnext].[Responsibles](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(200) NOT NULL,
    [Email] NVARCHAR(320) NULL,
    [Phone] NVARCHAR(40) NULL,
    [IsActive] BIT NOT NULL CONSTRAINT [CK_Responsibles_IsActive] DEFAULT(1),
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Responsibles_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Responsibles_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_Responsibles_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
GO

CREATE UNIQUE INDEX [IX_Responsibles_OrganizationId_Name] ON [capturnext].[Responsibles]([OrganizationId],[Name]) WHERE [IsActive] = 1;
GO

CREATE TABLE [capturnext].[Assets](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [LocationId] UNIQUEIDENTIFIER NULL,
    [ResponsibleId] UNIQUEIDENTIFIER NULL,
    [AssetTypeId] TINYINT NULL,
    [AssetStateId] TINYINT NOT NULL,
    [AssetCode] NVARCHAR(120) NOT NULL,
    [SerialNumber] NVARCHAR(120) NULL,
    [Brand] NVARCHAR(120) NULL,
    [Model] NVARCHAR(120) NULL,
    [Description] NVARCHAR(1000) NULL,
    [Value] DECIMAL(18,2) NULL,
    [PurchaseDateUtc] DATETIME2(3) NULL,
    [Observation] NVARCHAR(1000) NULL,
    [IsDeleted] BIT NOT NULL CONSTRAINT [CK_Assets_IsDeleted] DEFAULT(0),
    [DeletedAtUtc] DATETIME2(3) NULL,
    [DeletedReasonId] TINYINT NULL,
    [DeviceId] NVARCHAR(100) NULL,
    [ClientUpdatedAtUtc] DATETIME2(3) NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Assets_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_Assets_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_Assets_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Assets_Locations] FOREIGN KEY([LocationId]) REFERENCES [capturnext].[Locations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Assets_Responsibles] FOREIGN KEY([ResponsibleId]) REFERENCES [capturnext].[Responsibles]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Assets_CatalogAssetType] FOREIGN KEY([AssetTypeId]) REFERENCES [capturnext].[CatalogAssetType]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Assets_CatalogAssetState] FOREIGN KEY([AssetStateId]) REFERENCES [capturnext].[CatalogAssetState]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_Assets_CatalogDeletionReason] FOREIGN KEY([DeletedReasonId]) REFERENCES [capturnext].[CatalogDeletionReason]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [CK_Assets_DeletedAtUtc] CHECK ([IsDeleted] = 0 OR ([IsDeleted] = 1 AND [DeletedAtUtc] IS NOT NULL))
);
GO

CREATE UNIQUE INDEX [IX_Assets_OrganizationId_AssetCode] ON [capturnext].[Assets]([OrganizationId],[AssetCode]) WHERE [IsDeleted] = 0;
GO

CREATE INDEX [IX_Assets_OrganizationId_LocationId_AssetStateId] ON [capturnext].[Assets]([OrganizationId],[LocationId],[AssetStateId]);
GO

CREATE INDEX [IX_Assets_OrganizationId_SerialNumber] ON [capturnext].[Assets]([OrganizationId],[SerialNumber]) WHERE [SerialNumber] IS NOT NULL AND [IsDeleted] = 0;
GO

CREATE TABLE [capturnext].[AssetPhotos](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [AssetId] UNIQUEIDENTIFIER NOT NULL,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [FileName] NVARCHAR(260) NOT NULL,
    [MimeType] NVARCHAR(100) NOT NULL,
    [FileSize] BIGINT NOT NULL,
    [Hash] NVARCHAR(128) NOT NULL,
    [StorageUri] NVARCHAR(1000) NULL,
    [IsDeleted] BIT NOT NULL CONSTRAINT [CK_AssetPhotos_IsDeleted] DEFAULT(0),
    [DeletedAtUtc] DATETIME2(3) NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_AssetPhotos_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [UpdatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_AssetPhotos_UpdatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [UpdatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_AssetPhotos_Assets] FOREIGN KEY([AssetId]) REFERENCES [capturnext].[Assets]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetPhotos_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [CK_AssetPhotos_DeletedAtUtc] CHECK ([IsDeleted] = 0 OR ([IsDeleted] = 1 AND [DeletedAtUtc] IS NOT NULL))
);
GO

CREATE INDEX [IX_AssetPhotos_AssetId] ON [capturnext].[AssetPhotos]([AssetId]);
GO

CREATE TABLE [capturnext].[AssetMovements](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [AssetId] UNIQUEIDENTIFIER NOT NULL,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [MovementTypeId] TINYINT NOT NULL,
    [FromLocationId] UNIQUEIDENTIFIER NULL,
    [ToLocationId] UNIQUEIDENTIFIER NULL,
    [FromResponsibleId] UNIQUEIDENTIFIER NULL,
    [ToResponsibleId] UNIQUEIDENTIFIER NULL,
    [EffectiveAtUtc] DATETIME2(3) NOT NULL,
    [Reason] NVARCHAR(512) NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_AssetMovements_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CreatedBy] UNIQUEIDENTIFIER NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [FK_AssetMovements_Assets] FOREIGN KEY([AssetId]) REFERENCES [capturnext].[Assets]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_Organizations] FOREIGN KEY([OrganizationId]) REFERENCES [capturnext].[Organizations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_CatalogMovementType] FOREIGN KEY([MovementTypeId]) REFERENCES [capturnext].[CatalogMovementType]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_FromLocation] FOREIGN KEY([FromLocationId]) REFERENCES [capturnext].[Locations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_ToLocation] FOREIGN KEY([ToLocationId]) REFERENCES [capturnext].[Locations]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_FromResponsible] FOREIGN KEY([FromResponsibleId]) REFERENCES [capturnext].[Responsibles]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT [FK_AssetMovements_ToResponsible] FOREIGN KEY([ToResponsibleId]) REFERENCES [capturnext].[Responsibles]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION
);
GO

CREATE INDEX [IX_AssetMovements_AssetId] ON [capturnext].[AssetMovements]([AssetId]);
GO

CREATE TABLE [capturnext].[AuditEvents](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [UserId] UNIQUEIDENTIFIER NULL,
    [EntityName] NVARCHAR(128) NOT NULL,
    [EntityId] UNIQUEIDENTIFIER NULL,
    [Operation] NVARCHAR(64) NOT NULL,
    [Data] NVARCHAR(MAX) NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_AuditEvents_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [CorrelationId] UNIQUEIDENTIFIER NULL
);
GO

CREATE INDEX [IX_AuditEvents_OrganizationId] ON [capturnext].[AuditEvents]([OrganizationId]);
GO

CREATE TABLE [capturnext].[SyncOperations](
    [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    [OperationId] UNIQUEIDENTIFIER NOT NULL,
    [DeviceId] NVARCHAR(100) NOT NULL,
    [ClientId] NVARCHAR(100) NOT NULL,
    [OrganizationId] UNIQUEIDENTIFIER NOT NULL,
    [EntityName] NVARCHAR(128) NOT NULL,
    [EntityId] UNIQUEIDENTIFIER NULL,
    [OperationType] NVARCHAR(32) NOT NULL,
    [Payload] NVARCHAR(MAX) NOT NULL,
    [ClientUpdatedAtUtc] DATETIME2(3) NULL,
    [BaseVersion] VARBINARY(8) NULL,
    [Status] NVARCHAR(32) NOT NULL,
    [ErrorMessage] NVARCHAR(1000) NULL,
    [CreatedAtUtc] DATETIME2(3) NOT NULL CONSTRAINT [DF_SyncOperations_CreatedAtUtc] DEFAULT (SYSUTCDATETIME()),
    [ProcessedAtUtc] DATETIME2(3) NULL,
    [RowVersion] ROWVERSION NOT NULL,
    CONSTRAINT [UQ_SyncOperations_OperationId_DeviceId] UNIQUE([OperationId],[DeviceId])
);
GO

CREATE INDEX [IX_SyncOperations_OrganizationId_Status] ON [capturnext].[SyncOperations]([OrganizationId],[Status]);
GO

-- 3. Vistas o helpers opcionales
CREATE VIEW [capturnext].[vw_ActiveAssets] AS
SELECT *
FROM [capturnext].[Assets]
WHERE [IsDeleted] = 0;
GO

-- 4. Triggers para auditoría de UpdatedAtUtc
CREATE TRIGGER [capturnext].[TRG_Assets_UpdateTimestamp]
ON [capturnext].[Assets]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    UPDATE [capturnext].[Assets]
    SET [UpdatedAtUtc] = SYSUTCDATETIME()
    FROM [capturnext].[Assets] target
    INNER JOIN inserted i ON target.[Id] = i.[Id];
END;
GO

CREATE TRIGGER [capturnext].[TRG_Locations_UpdateTimestamp]
ON [capturnext].[Locations]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    UPDATE [capturnext].[Locations]
    SET [UpdatedAtUtc] = SYSUTCDATETIME()
    FROM [capturnext].[Locations] target
    INNER JOIN inserted i ON target.[Id] = i.[Id];
END;
GO

CREATE TRIGGER [capturnext].[TRG_Responsibles_UpdateTimestamp]
ON [capturnext].[Responsibles]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    UPDATE [capturnext].[Responsibles]
    SET [UpdatedAtUtc] = SYSUTCDATETIME()
    FROM [capturnext].[Responsibles] target
    INNER JOIN inserted i ON target.[Id] = i.[Id];
END;
GO

CREATE TRIGGER [capturnext].[TRG_Organizations_UpdateTimestamp]
ON [capturnext].[Organizations]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    UPDATE [capturnext].[Organizations]
    SET [UpdatedAtUtc] = SYSUTCDATETIME()
    FROM [capturnext].[Organizations] target
    INNER JOIN inserted i ON target.[Id] = i.[Id];
END;
GO

-- 5. Documentación de propósito
PRINT 'CapturNext SQL Server schema v1 created in schema capturnext';
