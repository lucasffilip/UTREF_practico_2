# Prendas API REST

Este es un ejercicio para el curso de backend de la Universidad 3 de Febrero, consistente en hacer un CRUD con node.js y MongoDB.

## Instalación

Desde la raíz del directorio del proyecto, ejecutar:
```
npm install
```
## Ejecución del servidor HTTP

Desde la raíz del directorio del proyecto, ejecutar:
```
npm start
```
Para acceder al servidor:
- http://localhost:3008
- http://127.0.0.1:3008

## Recursos y Endpoints

#### Para obtener todos los recursos: 
`GET /prendas/`

http://localhost:3008/prendas

---

#### Para obtener una prenda según su código:
`GET /prendas/{codigo}` 

http://localhost:3008/prendas/{codigo}

Siendo {codigo} un número entero positivo.

---

#### Para obtener una prenda por su nombre o parte de su nombre:
`GET /prendas/nombre/{nombre}` 

http://localhost:3008/prendas/nombre/{nombre}

Siendo {nombre} la cadena de caracteres sobre la que se quiere consultar.

---

#### Para obtener prendas por categoría o parte de la categoría:
`GET /prendas/categoria/{categoria}`

http://localhost:3008/prendas/categoria/{categoria}

Siendo {categoria} la cadena de caracteres sobre la que se quiere consultar.

---

#### Para agregar un nuevo recurso:
`POST /prendas/`

http://localhost:3008/prendas

---

#### Para modificar el atributo precio del recurso:
`PATCH /prendas/{codigo}`

http://localhost:3008/prendas/{codigo} 

Siendo {codigo} un número entero positivo correspondiente al recurso que se quiere modificar. Enviar dato en formato JSON con atributo "precio" y su correspondiente valor.

---

#### Para eliminar un recurso:
`DELETE /prendas/{codigo}`

http://localhost:3008/prendas/{codigo} 

Siendo {codigo} un número entero positivo correspondiente al recurso que se quiere eliminar.



