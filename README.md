# Instalación
1. Abrir una carpeta vacía donde irá el proyecto
2. Abrir una consola (cmd/bash/etc) en ese directorio
3. Clonar el repositorio
```sh
git clone https://github.com/kev-developer/Calidad-y-Pruebas-Proyecto.git
```
4. Instalar paquetes de npm (desde el directorio creado)
```sh
npm install
```
5. Ejecuta el proyecto usando
```sh
npm run dev
```
6. Para ver el proyecto ejecutado abre el localhost 3000
```sh
http://localhost:3000
```

# Como subir tus cambios
Puedes hacerlo a través de la interfaz de visual studio code o puedes hacer los siguientes comandos en alguna terminal...

1. Asegurate de tener todos los cambios de la rama principal en tu pc
```sh
git checkout master
```
2. Añade los cambios (el . es para añadir todos los archivos)
 ```sh
git add .
```
3. Comenta los cambios
```sh
git commit -m "comentario"
```
4. Haz un push
```sh
git push origin master
```
