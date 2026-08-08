Coloca aquí tus archivos de fuente personalizados.

Para esta app React Native 0.86, el archivo de fuente debe estar en:

  src/assets/fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf

Luego ejecuta en la raíz del proyecto:

  npx react-native-asset

O, si no está disponible:

  npx react-native link

Después, usa la fuente en estilos con `fontFamily`.

Nota: el valor de `fontFamily` debe coincidir con el nombre interno de la fuente.
