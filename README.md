README para montar el proyecto:

Esto es el frontend de nuestro proyecto, formado por vue 3.

## ¿Por qué utilizar vue 3?

Hemos utilizado vue 3, ya que es mucho más rápido y ligero que vue 2, además, tiene un motor de reactividad completamente reescrito y sus mayores ventajas son mejores tiempos de carga y renderizado.

## Versión de Node:

La versión mínima recomendada de Node.js para este proyecto es la versión 14.19.0 o superior, aunque es recomendable utilizar una versión más estable. 

En mi caso, estoy utilizando la versión 20.19.0

## Versión de NPM:

La versión mínima recomendada de npm para este proyecto es la versión 6 o superior. Aunque se recomienda utilizar la versión 8 o 9.

En mi caso, estoy utilizando la versión 10.8.2

## Una vez instaladas las versiones anteriores:

EL proyecto se ejecutará en el puerto 5173, si ya se está usando, se ejecutará en el puerto 5174, y así sucesivamente hasta que encuentre un puerto libre.

Ahora, escribir por consola este comando:

```sh
npm i
```

Una vez hecho esto, se creará la carpeta node_modules, para poder ejecutar nuestro proyecto (La cuál coge de el archivo package.json todas las librerías y las instala en la carpeta creada).

Para ejecutar el proyecto escribir en la terminal donde se encuentra este proyecto:

```sh
npm run dev
```


Y esperar hasta que en la terminal se pueda leer:

```sh
VITE v6.2.3  ready in 507 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  Vue DevTools: Open http://localhost:5173/__devtools__/ as a separate window
  ➜  Vue DevTools: Press Alt(⌥)+Shift(⇧)+D in App to toggle the Vue DevTools
  ➜  press h + enter to show help
```


Una vez se esté ejecutando el backend junto al frontend se podrá entrar en la página y se podrá ingresar su usuario seguido de su contraseña para iniciar sesión en ella. (Es importante ejecutar el backend, de lo contrario, dará error al intentar iniciar sesión).


## Explicación de los diferentes roles en mi proyecto:

Esto es muy importante. Para entender el proyecto se debe considerar que hay 2 tipos de roles en este proyecto, el rol de Viewer (Sólo puede ver las released Notes y el DashboardCliente, ninguna otra página) mientras que el rol administrador puede verlo todo, incluido lo anterior (Además de el Dashboard general y todas las solicitudes). Todo esto está gestionado por strapi y solo el programador o programadores saben el nombre y contraseña que se debe introducir para poder ver este proyecto.