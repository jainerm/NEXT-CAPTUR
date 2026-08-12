# Plan de arquitectura de datos y API

## 1. Objetivo

Definir la arquitectura necesaria para que CapturNext, aplicación móvil React Native con TypeScript para inventario de activos fijos, pueda persistir datos localmente y sincronizarlos con una API REST en C# sobre SQL Server.

El diseño debe:

- Mantener un modelo de datos consistente entre móvil, API y base de datos.
- Definir DTOs explícitos para evitar exponer directamente las entidades de persistencia.
- Proporcionar operaciones CRUD completas y validables.
- Proteger la información en tránsito mediante HTTPS y payloads JSON cifrados cuando el requerimiento lo exija.
- Soportar operación móvil con conectividad intermitente y sincronización controlada.
- Garantizar integridad referencial, validación de negocio, auditoría y control de concurrencia.

## 2. Estado actual y supuestos

### Estado verificado

- La app está basada en React Native `0.86.0`, TypeScript `5.8.3` y React Navigation.
- `App.tsx` referencia `src/navigation/RootNavigator` y la navegación activa expone módulos de inicio, inventario, reportes y ajustes.
- `InventoryScreen` contiene actualmente el formulario visual de captura, con estado local de React y acciones aún no conectadas a persistencia o servicios remotos.
- No se identificaron DTOs, servicios HTTP, persistencia local, API backend ni esquema SQL Server.
- El README identifica el producto como una app de inventario de activos fijos.

### Supuestos iniciales

Estos supuestos deben confirmarse con el responsable funcional antes de congelar el contrato:

- Un activo pertenece a una organización o empresa y puede asignarse a una ubicación y a un responsable.
- La captura móvil puede incluir identificación, descripción, estado, ubicación, responsable, fotografías y observaciones.
- La aplicación debe permitir crear y actualizar capturas sin conexión y sincronizarlas posteriormente.
- Las bajas deben conservar el historial; se propone baja lógica en lugar de eliminación física.
- Los identificadores serán UUID para evitar colisiones entre dispositivos.
- La API será ASP.NET Core con C#, Entity Framework Core y SQL Server.

## 3. Principios de diseño

1. **Contratos separados del almacenamiento:** las entidades EF Core no se exponen directamente en la API.
2. **Identidad estable:** cada registro tendrá `id`, `createdAt`, `updatedAt`, `version` y, cuando aplique, `deletedAt`.
3. **Integridad en capas:** validación en móvil para UX, en API para seguridad y en SQL Server para invariantes estructurales.
4. **Baja lógica y auditoría:** no eliminar información que pueda ser necesaria para trazabilidad.
5. **Idempotencia:** las operaciones de sincronización deben poder reintentarse sin duplicar datos.
6. **Seguridad por defecto:** HTTPS, autenticación, autorización por organización y cifrado autenticado para el payload sensible.
7. **Evolución del contrato:** versionado de API y compatibilidad controlada entre versiones de la app.

## 4. Arquitectura desacoplada Frontend-Backend

La solución se dividirá en dos aplicaciones independientes, conectadas únicamente mediante contratos versionados. La app móvil no conocerá entidades EF Core, tablas SQL Server, `DbContext` ni reglas internas de infraestructura; la API no dependerá de componentes visuales, navegación ni estado de React Native.

### Límites y responsabilidades

| Zona | Responsabilidades | Dependencias permitidas | Dependencias prohibidas |
|---|---|---|---|
| Frontend móvil | UI, navegación, validación de experiencia, persistencia local, cola offline y consumo de API | DTOs de transporte generados o tipados desde OpenAPI, interfaces de repositorio y cliente HTTP | SQL Server, EF Core, entidades de dominio del backend, reglas de infraestructura |
| Contrato API | OpenAPI, DTOs JSON, enums, códigos de error, versionado y ejemplos | Estándares HTTP/JSON y reglas públicas del contrato | Componentes de UI, tablas o clases EF como contrato público |
| Backend API | Autenticación, autorización, casos de uso, validación, transacciones, concurrencia, auditoría y sincronización | Contrato API, dominio, puertos de aplicación e infraestructura mediante interfaces | Dependencia directa de pantallas, modelos de estado del móvil o JSON sin versionar |
| Persistencia | SQL Server, EF Core, migraciones, índices, constraints y repositorios | Interfaces definidas por aplicación/dominio | Exposición directa de tablas o entidades EF al cliente |

### Regla de dependencias

La dirección de dependencias será: `UI -> casos de uso Frontend -> repositorios -> cliente API/persistencia local` y `API -> Application -> Domain <- Infrastructure`. El dominio no dependerá de HTTP, JSON, React Native, EF Core ni SQL Server. El Frontend y el Backend compartirán únicamente el contrato publicado; no se compartirá una librería con entidades de base de datos.

La implementación deberá separar, como mínimo, estas piezas en el móvil:

- `presentation`: pantallas, componentes, navegación y estado de UI.
- `application`: casos de uso como registrar, consultar, transferir, dar de baja y sincronizar activos.
- `domain`: tipos y reglas propias del cliente, sin clases de persistencia del backend.
- `data`: repositorios, mapeadores, SQLite, cola offline y adaptador HTTP.
- `security`: tokens, claves y cifrado del sobre JSON mediante almacenamiento seguro del dispositivo.

En el backend se mantendrán proyectos o módulos separados para `Api`, `Application`, `Domain` e `Infrastructure`. Los controladores solo traducirán HTTP a comandos/consultas y DTOs; no contendrán reglas de negocio ni acceso a `DbContext`. Los mapeadores serán explícitos entre DTO, comando, entidad y respuesta.

### Flujo de una operación

1. La pantalla solicita un caso de uso del Frontend; nunca llama `fetch` ni conoce rutas HTTP.
2. El caso de uso valida lo necesario para la experiencia y escribe en el repositorio local dentro de una transacción.
3. El repositorio encola una operación idempotente y el adaptador API la envía como contrato `v1` cuando hay conectividad.
4. La API autentica, autoriza por organización, descifra y valida el contrato, ejecuta el caso de uso en una transacción y persiste mediante infraestructura.
5. La respuesta se mapea a un modelo del Frontend; la UI solo observa estados `local`, `pendiente`, `sincronizado` o `conflicto`.

### Independencia verificable

Antes de implementar, el diseño deberá demostrar que:

- El Frontend puede probarse con un repositorio falso sin levantar API ni SQL Server.
- El Backend puede probarse con requests HTTP automatizados sin ejecutar React Native.
- La API puede cambiar SQL Server, EF Core o su esquema interno sin cambiar DTOs, mientras conserve el contrato.
- La app puede cambiar pantallas o navegación sin cambiar el dominio ni el contrato público.
- Los DTOs se validan con pruebas de contrato consumer/provider y OpenAPI versionado.
- Ningún import del Frontend apunta a clases del Backend o SQL, y ningún controlador contiene reglas de dominio.
- La compatibilidad se comprueba con una matriz de versiones de app, API y esquema, incluyendo migraciones hacia adelante y hacia atrás.

La Fase 1 deberá producir además un diagrama C4 o de contenedores, un diagrama de dependencias y una matriz de ownership que identifique quién modifica cada DTO, regla, migración y endpoint.

## 5. Modelo de dominio propuesto

### Entidades principales

| Entidad | Propósito | Relaciones principales |
|---|---|---|
| `Organization` | Empresa o tenant propietario de los datos | Tiene usuarios, ubicaciones y activos |
| `User` | Usuario autenticado que captura o administra | Pertenece a una organización |
| `Location` | Sede, edificio, área o ubicación física | Contiene activos; puede tener jerarquía |
| `Responsible` | Persona o área responsable del activo | Puede asociarse a varios activos |
| `Asset` | Registro principal del activo fijo | Pertenece a organización, ubicación y responsable opcional |
| `AssetPhoto` | Metadatos de fotografías del activo | Pertenece a un activo |
| `AssetMovement` | Historial de cambios de ubicación o responsable | Pertenece a un activo |
| `AuditEvent` | Historial de acciones sobre datos | Referencia usuario, entidad y operación |
| `SyncOperation` | Registro de cambios enviados por dispositivos | Permite idempotencia y resolución de conflictos |

### Campos base recomendados para entidades sincronizables

- `Id` (`uniqueidentifier`, UUID).
- `OrganizationId` (`uniqueidentifier`) cuando corresponda.
- `CreatedAtUtc`, `UpdatedAtUtc` (`datetime2` en UTC).
- `CreatedBy`, `UpdatedBy` (`uniqueidentifier`) cuando corresponda.
- `IsDeleted`, `DeletedAtUtc` para baja lógica.
- `RowVersion` (`rowversion`) para concurrencia optimista.
- `ClientUpdatedAtUtc` y `DeviceId` en operaciones originadas en móvil.

### Catálogos iniciales

Definir como catálogos controlados, con claves estables y valores configurables:

- Estados del activo: `Pending`, `Active`, `Missing`, `Damaged`, `Retired`.
- Tipos de activo.
- Tipos de ubicación.
- Tipos de movimiento.
- Motivos de baja o ajuste.

No se deben usar textos libres para valores que deban mantener consistencia entre dispositivos.

## 6. DTOs a definir

Los DTOs se organizarán por intención. Los nombres son una propuesta inicial y deberán reflejar el lenguaje ubicuo validado con el negocio.

### DTOs comunes

- `ResourceIdDto`: identificador del recurso.
- `AuditMetadataDto`: fechas, usuario y versión.
- `PagedResultDto<T>`: elementos, página, tamaño, total y cursor opcional.
- `ApiErrorDto`: código, mensaje, detalles de validación, correlation ID.
- `ValidationErrorDto`: campo, código y mensaje localizado.

### Organización y autenticación

- `LoginRequestDto`: usuario, credencial y dispositivo.
- `LoginResponseDto`: access token, refresh token, expiración, usuario y organización.
- `RefreshTokenRequestDto` y `RefreshTokenResponseDto`.
- `OrganizationResponseDto`.
- `UserResponseDto`.

Las credenciales nunca deben formar parte de respuestas ni de logs.

### Ubicación y responsables

- `LocationCreateDto`: nombre, tipo, código, ubicación padre opcional.
- `LocationUpdateDto`: campos editables y `rowVersion` esperada.
- `LocationResponseDto`: datos públicos y metadatos de auditoría.
- `ResponsibleCreateDto` y `ResponsibleUpdateDto`.
- `ResponsibleResponseDto`.

### Activo

- `AssetCreateDto`: código o etiqueta, tipo, descripción, marca, modelo, número de serie, estado inicial, ubicación, responsable, valor opcional y observaciones.
- `AssetUpdateDto`: únicamente campos editables, `rowVersion` esperada y motivo del cambio cuando aplique.
- `AssetResponseDto`: representación completa para detalle.
- `AssetListItemDto`: representación resumida para listados.
- `AssetFilterDto`: texto, código, serie, tipo, estado, ubicación, responsable, fechas y cursor/paginación.
- `AssetStatusChangeDto`: nuevo estado, motivo y versión esperada.
- `AssetTransferDto`: nueva ubicación, nuevo responsable, fecha efectiva y motivo.

### Fotografías

- `AssetPhotoCreateDto`: nombre, tipo MIME, tamaño, hash, contenido cifrado o referencia a almacenamiento de objetos.
- `AssetPhotoResponseDto`: identificador, URL temporal o referencia, hash, fecha y tamaño.
- `AssetPhotoDeleteDto`: versión esperada y motivo.

Para archivos grandes, se debe preferir carga multipart o URL prefirmada; el CRUD JSON manejará los metadatos y no imágenes embebidas ilimitadas en Base64.

### Sincronización

- `SyncPushRequestDto`: `deviceId`, `clientId`, cursor de última sincronización y operaciones.
- `SyncOperationDto`: `operationId`, entidad, entidad ID, operación, payload, `clientUpdatedAtUtc` y versión base.
- `SyncPushResponseDto`: operaciones aceptadas, rechazadas, conflictos e identificadores asignados.
- `SyncPullResponseDto`: cambios desde un cursor, siguiente cursor y marca de continuidad.
- `SyncConflictDto`: estado del servidor, estado del cliente y estrategia aplicada.

## 7. Persistencia local móvil

Evaluar y seleccionar una tecnología compatible con React Native para SQLite, preferentemente una solución mantenida y con soporte transaccional. La decisión debe documentar:

- Tablas locales equivalentes a los recursos sincronizables.
- Cola `pending_sync_operations` con reintentos y estado.
- Índices para búsquedas offline por código, serie, estado y ubicación.
- Transacciones para guardar activo, fotografías y movimiento como una sola unidad local.
- Cifrado del almacenamiento local y protección de claves usando Keychain/Keystore.
- Política de retención de datos y limpieza segura al cerrar sesión.

La UI debe leer de la base local y actualizar la cola; la red no debe ser una dependencia de cada pantalla.

## 8. Diseño de SQL Server

### Tablas propuestas

- `Organizations`.
- `Users` y `RefreshTokens`.
- `Locations`.
- `Responsibles`.
- `Assets`.
- `AssetPhotos`.
- `AssetMovements`.
- `AuditEvents`.
- `SyncOperations`.
- Tablas de catálogos y migraciones de esquema.

### Reglas de integridad

- Claves primarias UUID y claves foráneas con nombres explícitos.
- Índices únicos por organización para código de activo y, si el negocio lo exige, número de serie.
- `NOT NULL` en campos obligatorios; longitudes máximas definidas en esquema y DTOs.
- Checks para estados y valores no negativos.
- Restricción para impedir que una ubicación padre sea ella misma o genere ciclos.
- Restricciones de tenant: toda consulta y relación debe filtrar por `OrganizationId`.
- `rowversion` para evitar sobrescritura silenciosa.
- Índices para listados frecuentes y búsquedas de sincronización.
- Migraciones EF Core revisadas y aplicadas mediante un proceso controlado.
- Eliminación física restringida a datos técnicos; los activos de negocio se desactivan.

### Modelo DDL (Data Definition Language)

El plan incluirá un modelo DDL físico y ejecutable para SQL Server. El DDL será la especificación versionada de la estructura de persistencia, independiente de los DTOs y del contrato HTTP, pero trazable hacia las entidades, casos de uso y operaciones CRUD.

El modelo DDL deberá contener, como mínimo:

- `CREATE SCHEMA` y definición de tablas con tipos SQL Server, nulabilidad, longitudes y valores por defecto.
- Claves primarias, claves foráneas, acciones de actualización/eliminación y nombres deterministas para todas las constraints.
- `UNIQUE`, `CHECK` y restricciones de tenant para garantizar unicidad, estados válidos, valores no negativos y referencias consistentes.
- Columnas de auditoría, baja lógica, `rowversion`, fechas UTC y claves de idempotencia.
- Índices clustered/nonclustered, índices únicos filtrados y estrategia de paginación y búsqueda.
- Tablas de catálogos, semillas controladas y tablas de auditoría y sincronización.
- Vistas o procedimientos almacenados únicamente cuando exista una decisión justificada; la lógica de negocio permanecerá en la capa de aplicación.
- Scripts de creación, actualización y reversión compatibles con ambientes nuevos y existentes, con orden explícito para dependencias.

El DDL se mantendrá en control de versiones y cada cambio deberá incluir propósito, impacto, migración hacia adelante, estrategia de reversión o recuperación y prueba de compatibilidad. Las migraciones EF Core podrán generar o aplicar cambios, pero no sustituirán la documentación del modelo físico: se deberá revisar que el SQL resultante coincida con el DDL aprobado. Nunca se modificarán tablas productivas manualmente fuera del mecanismo versionado.

## 9. API REST en C#

### Base técnica

- ASP.NET Core Web API, C# y Entity Framework Core SQL Server.
- Arquitectura por capas: `Api`, `Application`, `Domain`, `Infrastructure`.
- OpenAPI/Swagger para contrato y generación de clientes.
- El contrato OpenAPI será la frontera oficial entre sistemas; los DTOs públicos se versionarán bajo `/api/v1` y no serán derivados automáticamente de entidades EF.
- Publicar un paquete o artefacto de contrato generado para TypeScript solo si contiene tipos de transporte, sin lógica ni modelos de persistencia compartidos.
- FluentValidation o validación equivalente en la capa de aplicación.
- Problem Details (`application/problem+json`) para errores.
- Correlation ID y logging estructurado sin datos sensibles.

### Endpoints iniciales

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Autenticar usuario/dispositivo |
| `POST` | `/api/v1/auth/refresh` | Renovar sesión |
| `GET` | `/api/v1/assets` | Listar y filtrar activos |
| `GET` | `/api/v1/assets/{id}` | Consultar detalle |
| `POST` | `/api/v1/assets` | Crear activo |
| `PUT` | `/api/v1/assets/{id}` | Reemplazar campos editables con concurrencia |
| `PATCH` | `/api/v1/assets/{id}/status` | Cambiar estado con motivo |
| `DELETE` | `/api/v1/assets/{id}` | Solicitar baja lógica |
| `GET` | `/api/v1/locations` | Consultar ubicaciones |
| `POST` | `/api/v1/locations` | Crear ubicación |
| `PUT` | `/api/v1/locations/{id}` | Actualizar ubicación |
| `DELETE` | `/api/v1/locations/{id}` | Desactivar ubicación sin activos dependientes |
| `GET` | `/api/v1/responsibles` | Consultar responsables |
| `POST` | `/api/v1/assets/{id}/photos` | Registrar o iniciar carga de fotografía |
| `DELETE` | `/api/v1/assets/{id}/photos/{photoId}` | Dar de baja una fotografía |
| `POST` | `/api/v1/sync/push` | Enviar cambios locales |
| `GET` | `/api/v1/sync/pull?cursor={cursor}` | Recibir cambios del servidor |

Las respuestas de creación deben devolver `201 Created` y `Location`; actualizaciones exitosas `200` o `204`; bajas repetidas deben ser idempotentes; conflictos de versión deben devolver `409 Conflict`.

### Criterio CRUD

Cada recurso debe documentar antes de implementarse:

- Campos obligatorios y opcionales para alta.
- Campos editables y campos inmutables.
- Reglas de unicidad y referencias válidas.
- Comportamiento ante duplicados (`409`).
- Comportamiento de baja lógica y recuperación, si procede.
- Reglas de autorización por rol y organización.
- Respuesta paginada y ordenamiento estable para consultas.
- Auditoría de `Create`, `Update`, `Delete`, transferencia y cambio de estado.

## 10. Cifrado y seguridad

### Transporte

- HTTPS obligatorio con TLS moderno; rechazar HTTP en producción.
- Validación de certificados en móvil y, si el contexto de despliegue lo permite, certificate pinning con estrategia de rotación.

### Payload JSON cifrado

No implementar criptografía propia. Definir una de estas alternativas durante el diseño técnico:

1. **JWE estándar**, preferido si el stack móvil y backend tienen soporte estable.
2. **Sobre cifrada**, con AES-256-GCM para confidencialidad e integridad del contenido y envoltura de la clave mediante RSA-OAEP-256 o gestión de claves equivalente.

El sobre debe incluir versión, algoritmo, `keyId`, nonce/IV, ciphertext, tag, `requestId`, timestamp y expiración. El servidor debe rechazar nonces repetidos, mensajes expirados y solicitudes duplicadas fuera de la ventana idempotente.

- Separar autenticación/autorización de cifrado de contenido.
- Guardar claves fuera del código y de la base de datos, idealmente en Azure Key Vault u HSM.
- Definir rotación, revocación, recuperación y distribución de claves.
- No registrar payloads descifrados, tokens, claves, fotografías ni datos personales.
- Aplicar rate limiting, bloqueo progresivo, validación de tamaño y protección contra replay.

## 11. Concurrencia y sincronización

### Estrategia propuesta

- El servidor es la autoridad final para integridad y permisos.
- Cada operación móvil lleva `operationId` único para idempotencia.
- Las actualizaciones incluyen `rowVersion` o `baseVersion`.
- Si la versión no coincide, devolver conflicto detallado en vez de sobrescribir.
- Los cambios de ubicación, responsable y estado se registran como movimientos auditables.
- La sincronización usa cursor monotónico y lotes acotados.
- Los borrados lógicos se propagan como cambios para que los dispositivos no revivan registros eliminados.

Definir con negocio la política por campo: rechazo, último cambio válido, merge de campos o revisión manual. No asumir automáticamente "última escritura gana" para movimientos de activos.

## 12. Fases de trabajo

### Fase 0: descubrimiento y validación

- Confirmar actores, roles, tenant, catálogos y reglas de inventario.
- Definir qué datos son obligatorios en una captura.
- Confirmar volumen, fotografías, retención y requisitos regulatorios.
- Validar flujos offline, sincronización y resolución de conflictos.
- Aprobar el modelo conceptual y el glosario.

**Entregables:** mapa de procesos, glosario, decisiones registradas y criterios de aceptación funcionales.

### Fase 1: contrato de datos

- Convertir el modelo conceptual en esquema lógico.
- Definir DTOs, enums, errores y convenciones JSON.
- Especificar paginación, filtros, ordenamiento y versionado.
- Publicar contrato OpenAPI inicial.
- Definir la matriz de ownership del contrato y compatibilidad entre versiones.
- Elaborar diagrama de contenedores y matriz de dependencias Frontend-API-Backend.

**Entregables:** catálogo de entidades, matriz DTO-entidad, OpenAPI y ejemplos de solicitudes/respuestas.

### Fase 2: diseño de persistencia

- Diseñar tablas, claves, índices, constraints y auditoría.
- Construir el modelo DDL físico de SQL Server con scripts versionados de creación, actualización y reversión.
- Definir migraciones EF Core y datos semilla de catálogos.
- Diseñar almacenamiento de fotografías y referencias.
- Definir estrategia de respaldo, restauración y retención.
- Trazar cada tabla y constraint hacia entidades, DTOs, endpoints y reglas CRUD; identificar explícitamente los campos que no se exponen por API.

**Entregables:** diagrama ER, modelo DDL aprobado, scripts SQL versionados, migraciones EF Core revisadas, diccionario de datos, matriz de trazabilidad y plan de operación SQL Server.

### Fase 3: backend y seguridad

- Crear solución ASP.NET Core por capas.
- Mantener la solución Backend independiente del repositorio y ciclo de compilación del móvil; integrar solo mediante OpenAPI y pruebas de contrato.
- Implementar autenticación, autorización por organización y roles.
- Implementar CRUD de catálogos, ubicaciones, responsables y activos.
- Implementar cifrado de payload, gestión de claves, auditoría y errores.
- Implementar concurrencia e idempotencia.

**Entregables:** API desplegable, documentación OpenAPI, matriz de permisos y configuración segura por ambiente.

### Fase 4: persistencia y sincronización móvil

- Integrar SQLite y almacenamiento seguro de credenciales/claves.
- Crear repositorios locales y cola transaccional de operaciones.
- Implementar cliente API con renovación de token y reintentos limitados.
- Implementar push/pull, cursores, conflictos y recuperación ante fallos.
- Conectar pantallas a repositorios, no directamente a HTTP.
- Sustituir el estado de captura de `InventoryScreen` por casos de uso y repositorios, conservando la pantalla independiente del transporte.

**Entregables:** flujo offline funcional, sincronización observable y estados de UI para pendiente, sincronizado y conflicto.

### Fase 5: calidad y puesta en producción

- Ejecutar pruebas unitarias, integración, contrato, seguridad y carga.
- Probar migraciones y restauración de SQL Server.
- Validar dispositivos con conectividad intermitente y relojes desfasados.
- Configurar observabilidad, alertas y trazabilidad por correlation ID.
- Ejecutar piloto con datos no productivos y plan de reversa.

**Entregables:** informe de pruebas, checklist de seguridad, runbook, métricas y aprobación de producción.

## 13. Pruebas y criterios de aceptación

### Pruebas mínimas

- CRUD exitoso y validaciones negativas para cada recurso.
- Rechazo de referencias inexistentes, duplicados y cambios de tenant.
- Concurrencia: dos clientes editando la misma versión produce `409` controlado.
- Baja lógica: el activo no aparece en listados activos y permanece auditable.
- Reintento de la misma operación no crea duplicados.
- Cifrado: payload alterado, expirado o con `keyId` inválido es rechazado.
- Sincronización con pérdida de red, reordenamiento y duplicación de mensajes.
- Autorización: ningún rol puede leer o modificar recursos fuera de su organización.
- Pruebas de migración, índices, restauración y rendimiento de listados.
- Ejecución del DDL desde una base vacía y actualización sobre una versión previa sin pérdida no autorizada de datos.
- Verificación de claves, índices, `CHECK`, `UNIQUE`, `rowversion`, baja lógica, tenant e idempotencia mediante pruebas SQL automatizadas.
- Comparación del esquema desplegado con el modelo DDL aprobado y revisión del SQL generado por migraciones EF Core.
- Pruebas de arquitectura que fallen ante una dependencia prohibida entre UI, contrato, dominio, API o persistencia.
- Pruebas de contrato provider/consumer para requests, respuestas, errores, cifrado y compatibilidad de versiones.
- Pruebas de aislamiento: Frontend con dobles de repositorio y Backend con dobles de infraestructura.

### Aceptación del plan

El diseño estará listo para implementación cuando exista aprobación explícita de:

- Modelo de entidades y relaciones.
- DTOs y contrato OpenAPI versionado.
- Reglas de integridad y matriz CRUD por rol.
- Modelo DDL, scripts versionados y matriz de trazabilidad entre persistencia, DTOs, endpoints y CRUD.
- Estrategia de baja, auditoría y concurrencia.
- Algoritmo de cifrado y ciclo de vida de claves.
- Estrategia offline, sincronización y conflictos.
- Diagrama y matriz de dependencias que demuestren independencia entre Frontend, contrato, API y persistencia.
- Pruebas de contrato y compatibilidad aprobadas para las versiones soportadas.
- Plan de pruebas, despliegue, respaldo y recuperación.

## 14. Riesgos y decisiones pendientes

- El modelo funcional aún no está representado en código; la Fase 0 es obligatoria para evitar DTOs basados en supuestos incorrectos.
- El cifrado de payload aumenta complejidad operativa; debe justificarse frente a HTTPS, clasificación de datos y requisitos regulatorios.
- Fotografías pueden superar los límites razonables de una API JSON; se debe aprobar almacenamiento de objetos y carga resumible.
- La estrategia de conflictos debe ser específica para movimientos y estados de activos.
- Deben definirse roles, multiempresa, retención de auditoría, volumen esperado y SLA antes de dimensionar SQL Server.

## 15. Resultado esperado

Al finalizar el plan se contará con una base aprobada para implementar, de forma trazable y por fases, una solución compuesta por:

- App móvil con persistencia local segura.
- API REST versionada en C# con DTOs y validación.
- SQL Server con integridad referencial, índices, auditoría y migraciones.
- Modelo DDL físico versionado, reproducible y validado contra SQL Server.
- JSON cifrado mediante estándar y gestión formal de claves.
- CRUD completo con bajas lógicas, autorización y control de concurrencia.
- Sincronización offline idempotente y resolución explícita de conflictos.
- Independencia verificable entre la experiencia móvil, el contrato API, los casos de uso backend y SQL Server, permitiendo evolucionar cada parte sin acoplamiento accidental.
