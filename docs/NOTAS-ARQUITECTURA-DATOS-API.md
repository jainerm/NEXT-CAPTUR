# Notas del Script de SQL SERVER estructura de datos:

## 1. Archivos generados

CapturNext_Schema_v1.sql
CapturNext_Schema_v1_SeedAndDrop.sql

## 2. Contenido incluido:

- Esquema capturnext
- Tablas principales y catálogos
- CREATE TABLE, FOREIGN KEY, CHECK, UNIQUE, índices y ROWVERSION
- Triggers de actualización de UpdatedAtUtc
- Script de seed para catálogos
- Script de rollback/drop ordenado por dependencias

## 3. Notas adicionales sobre la definicion del esquema SQL Server para Activos fijos:

IsActive se usa para distinguir un registro válido/usable del que está desactivado, sin eliminarlo físicamente.

### 3.1. Usos principales

1. Catalog*:
    - Permite tener valores de catálogo desactivados sin borrar la fila.
    - El API o la UI pueden filtrar solo los catálogos activos.
2. Entidades como Users, Locations, Responsibles, Organizations:
    - mite deshabilitar un usuario, una ubicación o una organización sin perder el historial.
    - Ayuda a mantener integridad histórica y auditoría.
3. Es diferente de IsDeleted:
    - IsDeleted indica baja lógica de negocio y generalmente se usa para ocultar el recurso de listados activos.
    - IsActive puede ser un estado intermedio 

## 4. Ventajas

1. Evita eliminar datos críticos.
2. Facilita reglas de negocio:
    - solo activos pueden ser asociados a nuevos activos,
    - solo catálogos activos se muestran en listados.
3. Hace más claro el comportamiento a nivel de aplicación.

## 5. Por qué Assets usa IsDeleted y no IsActive

1. En la tabla Assets, el ciclo de vida del activo se modela con:
    - AssetStateId → estado del activo (Pending, Active, Missing, Damaged, Retired)
    - IsDeleted + DeletedAtUtc → baja lógica / eliminación del registro
2. IsActive no se usa en Assets porque:
    - ya existe un catálogo de estados (CatalogAssetState) para distinguir si un activo está activo, retirado, dañado, etc.
    - IsDeleted es el marcador específico de “registro eliminado lógicamente”, que se usa para ocultar el activo de listados activos sin perder su historial.
3. En cambio, IsActive sí se usa en catálogos y entidades como Users, Locations, Responsibles, Organizations para marcar referencias que pueden deshabilitarse sin eliminarlas.


### 6. Resumen

- IsDeleted = baja lógica del registro de negocio (activo ya no debe aparecer en inventarios activos).
AssetStateId = estado operacional del activo.
- IsActive = generalmente para catálogos o entidades de referencia, no para el ciclo de vida principal de un activo.

