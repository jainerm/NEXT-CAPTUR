USE [CAPTUR_NEXT];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;

DECLARE @SchemaName SYSNAME = N'capturnext';
DECLARE @SchemaId INT;
DECLARE @SQL NVARCHAR(MAX);

------------------------------------------------------------
-- VALIDAR QUE EL SCHEMA EXISTA
------------------------------------------------------------
SELECT @SchemaId = schema_id
FROM sys.schemas
WHERE name = @SchemaName;

IF @SchemaId IS NULL
BEGIN
    PRINT 'El schema [' + @SchemaName + '] no existe.';
    RETURN;
END;

PRINT '============================================';
PRINT 'ELIMINANDO SCHEMA: [' + @SchemaName + ']';
PRINT 'BASE DE DATOS: ' + DB_NAME();
PRINT '============================================';

BEGIN TRY

    BEGIN TRANSACTION;

    ------------------------------------------------------------
    -- 1. ELIMINAR FOREIGN KEYS
    --
    -- Incluye:
    --   - FK dentro de capturnext
    --   - FK de otros schemas que referencien capturnext
    ------------------------------------------------------------
    PRINT '1. Eliminando FOREIGN KEYS...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'ALTER TABLE '
        + QUOTENAME(OBJECT_SCHEMA_NAME(fk.parent_object_id))
        + N'.'
        + QUOTENAME(OBJECT_NAME(fk.parent_object_id))
        + N' DROP CONSTRAINT '
        + QUOTENAME(fk.name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.foreign_keys fk
    WHERE fk.parent_object_id IN
    (
        SELECT object_id
        FROM sys.tables
        WHERE schema_id = @SchemaId
    )
    OR fk.referenced_object_id IN
    (
        SELECT object_id
        FROM sys.tables
        WHERE schema_id = @SchemaId
    );

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 2. ELIMINAR VISTAS
    ------------------------------------------------------------
    PRINT '2. Eliminando VIEWS...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP VIEW '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.views
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 3. ELIMINAR PROCEDIMIENTOS ALMACENADOS
    ------------------------------------------------------------
    PRINT '3. Eliminando STORED PROCEDURES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP PROCEDURE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.procedures
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 4. ELIMINAR FUNCIONES
    ------------------------------------------------------------
    PRINT '4. Eliminando FUNCTIONS...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP FUNCTION '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.objects
    WHERE schema_id = @SchemaId
      AND type IN
      (
          'FN',   -- SQL scalar function
          'IF',   -- Inline table-valued function
          'TF',   -- SQL table-valued function
          'FS',   -- CLR scalar function
          'FT'    -- CLR table-valued function
      );

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 5. ELIMINAR AGGREGATES CLR
    ------------------------------------------------------------
    PRINT '5. Eliminando CLR AGGREGATES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP AGGREGATE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.objects
    WHERE schema_id = @SchemaId
      AND type = 'AF';

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 6. ELIMINAR SYNONYMS
    ------------------------------------------------------------
    PRINT '6. Eliminando SYNONYMS...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP SYNONYM '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.synonyms
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 7. ELIMINAR TABLAS
    ------------------------------------------------------------
    PRINT '7. Eliminando TABLES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP TABLE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.tables
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 8. ELIMINAR SEQUENCES
    ------------------------------------------------------------
    PRINT '8. Eliminando SEQUENCES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP SEQUENCE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.sequences
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 9. ELIMINAR TIPOS DEFINIDOS POR EL USUARIO
    ------------------------------------------------------------
    PRINT '9. Eliminando USER DEFINED TYPES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP TYPE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.types
    WHERE schema_id = @SchemaId
      AND is_user_defined = 1
      AND is_table_type = 0;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 10. ELIMINAR TABLE TYPES
    ------------------------------------------------------------
    PRINT '10. Eliminando TABLE TYPES...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP TYPE '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.table_types
    WHERE schema_id = @SchemaId;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 11. ELIMINAR XML SCHEMA COLLECTIONS
    ------------------------------------------------------------
    PRINT '11. Eliminando XML SCHEMA COLLECTIONS...';

    SET @SQL = N'';

    SELECT @SQL = @SQL +
        N'DROP XML SCHEMA COLLECTION '
        + QUOTENAME(@SchemaName)
        + N'.'
        + QUOTENAME(name)
        + N';'
        + CHAR(13) + CHAR(10)
    FROM sys.xml_schema_collections
    WHERE schema_id = @SchemaId
      AND xml_collection_id > 0;

    IF @SQL <> N''
        EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- 12. VERIFICAR SI QUEDAN OBJETOS
    ------------------------------------------------------------
    IF EXISTS
    (
        SELECT 1
        FROM sys.objects
        WHERE schema_id = @SchemaId
    )
    BEGIN

        SELECT
            name AS Objeto,
            type_desc AS Tipo
        FROM sys.objects
        WHERE schema_id = @SchemaId;

        THROW 50001,
              'Todavia existen objetos dentro del schema. Se cancela la operacion.',
              1;
    END;


    ------------------------------------------------------------
    -- 13. VERIFICAR OTROS ELEMENTOS DEL SCHEMA
    ------------------------------------------------------------
    IF EXISTS
    (
        SELECT 1
        FROM sys.sequences
        WHERE schema_id = @SchemaId
    )
    BEGIN
        THROW 50002,
              'Todavia existen SEQUENCES dentro del schema.',
              1;
    END;


    ------------------------------------------------------------
    -- 14. ELIMINAR EL SCHEMA
    ------------------------------------------------------------
    PRINT '12. Eliminando SCHEMA...';

    SET @SQL =
        N'DROP SCHEMA '
        + QUOTENAME(@SchemaName)
        + N';';

    EXEC sp_executesql @SQL;


    ------------------------------------------------------------
    -- TODO CORRECTO
    ------------------------------------------------------------
    COMMIT TRANSACTION;

    PRINT '============================================';
    PRINT 'SCHEMA [' + @SchemaName + '] ELIMINADO CORRECTAMENTE.';
    PRINT '============================================';

END TRY

BEGIN CATCH

    ------------------------------------------------------------
    -- SI ALGO FALLA, DESHACER TODO
    ------------------------------------------------------------
    IF XACT_STATE() <> 0
        ROLLBACK TRANSACTION;

    PRINT '============================================';
    PRINT 'ERROR. SE HIZO ROLLBACK.';
    PRINT '============================================';

    PRINT 'Error: ' + ERROR_MESSAGE();
    PRINT 'Linea: ' + CAST(ERROR_LINE() AS VARCHAR(20));
    PRINT 'Numero: ' + CAST(ERROR_NUMBER() AS VARCHAR(20));

    THROW;

END CATCH;
GO
