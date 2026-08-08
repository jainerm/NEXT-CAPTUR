# NEXT-CAPTUR

Proyecto APP de Inventario de activos fijos

![React Native](https://img.shields.io/badge/React_Native-0.86.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)

CapturNext es una aplicación móvil desarrollada en React Native para [descripción breve del proyecto].

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v22.11.0+)
- [Watchman](https://facebook.github.io/watchman/) (para macOS)
- SDK de Android / Xcode para iOS
- [CocoaPods](https://cocoapods.org/) (para iOS)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/jainerm/NEXT-CAPTUR.git
   cd CapturNext
   ```

2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

3. Instala las dependencias de iOS (solo macOS):
   ```bash
   cd ios && pod install && cd ..
   ```

## 🛠️ Desarrollo

Para iniciar el servidor de Metro:

```bash
npm start
```

Para ejecutar en un dispositivo/emulador:

```bash
# Android
npm run android

# iOS
npm run ios
```

## 📁 Estructura del Proyecto

- `src/`: Código fuente de la aplicación.
  - `assets/`: Imágenes, fuentes y otros recursos estáticos.
  - `core/`: Componentes y utilidades base.
  - `modules/`: Módulos funcionales de la app.
  - `navigation/`: Configuración de navegadores.
  - `screens/`: Pantallas principales.
  - `theme/`: Estilos globales y temas.

## 🧪 Pruebas

Para ejecutar los tests de Jest:

```bash
npm test
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

