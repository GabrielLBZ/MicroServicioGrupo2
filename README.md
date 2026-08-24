Backend Base en Express con TypeScript + MongoDB

--------------------------------------------------------------------------------

Estructura Base:

.
├── src
│   ├── config
│   │   └── mongodb.config.ts     → Configuración MongoDB
│   │
│   ├── models                    → Modelos y colecciones MongoDB
│   ├── routers                   → Rutas de la API
│   ├── controllers               → Controladores (http)
│   ├── services                  → Servicios (lógica de negocio)
│   ├── repositorys               → Acceso a datos MongoDB
│   ├── utils                     → Extras (constantes, etc)
│   │
│   └── index.ts                  → Punto de entrada de la app
│
├── .env                  → Variables de entorno
├── .gitignore            → Todo lo que ignora git al subir al repositorio           
├── package.json
└── tsconfig.json

--------------------------------------------------------------------------------

Flujo:

1) Router

Define las rutas de la API y llama al controlador correspondiente.
- No contiene lógica.

2) Controller

Recibe la request, llama al service y devuelve una respuesta.
- No contiene lógica.

3) Service

Contiene la lógica de negocio y llama a repository si hace falta.

4) Repository

Capa que accede a la base de datos y devuelve una respuesta a service.

5) Models

Define las colecciones de MongoDB y los tipos usados por repository.

--------------------------------------------------------------------------------

Scripts disponibles

- Modo desarrollo

npm run dev

- Compilar TypeScript

npm run build

- Ejecutar versión compilada

npm start

--------------------------------------------------------------------------------

Endpoint de prueba

GET /

Responde:

- Fecha del servidor

- Ping Mongo (db.command())

- Resultado de 1 + 1

Sirve para verificar que TODO funciona correctamente.

--------------------------------------------------------------------------------

Ejemplo de endpoints principales de usuarios

Colección MongoDB usada: usuarios

Crear usuario

POST /api/users

Body:

```json
{
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "edad": 25
}
```

Listar usuarios

GET /api/users

Obtener usuario por id

GET /api/users/64f1a2b3c4d5e6f789012345

Actualizar usuario

PUT /api/users/64f1a2b3c4d5e6f789012345

Body:

```json
{
  "nombre": "Juan Perez actualizado",
  "edad": 26
}
```

Eliminar usuario

DELETE /api/users/64f1a2b3c4d5e6f789012345

--------------------------------------------------------------------------------

Ejemplo de endpoints de travel plans

Colección MongoDB usada: travelPlans

Generar plan de viaje con Gemini

POST /api/travel-plans/generar

Body:

```json
{
  "prompt": "Quiero viajar 5 dias a Mendoza con bajo presupuesto"
}
```

Listar planes generados

GET /api/travel-plans

Obtener plan generado por id

GET /api/travel-plans/64f1a2b3c4d5e6f789012345

Variables de entorno necesarias:

- GEMINI_API_KEY
- GEMINI_MODEL opcional, por defecto usa gemini-3.1-flash-lite

--------------------------------------------------------------------------------

Ejemplo de endpoints de conversaciones (recolección conversacional del viaje)

Colección MongoDB usada: conversacionesViaje

Este módulo conversa con el usuario en lenguaje natural y va armando, mensaje a mensaje, el perfil estructurado (JSON) del viaje que quiere hacer (fechas, presupuesto, viajeros, destino, preferencias, restricciones, etc.), sin todavía recomendar destinos concretos.

Enviar un mensaje

POST /api/conversaciones/mensaje

Body (primer mensaje, sin conversacionId):

```json
{
  "usuarioId": "64f1a2b3c4d5e6f789012345",
  "mensaje": "Quiero viajar el mes que viene por unos 10 dias, tengo 1000 USD, somos dos amigos y buscamos calor y playa"
}
```

Body (mensajes siguientes, ya con conversacionId devuelto por el primer mensaje):

```json
{
  "usuarioId": "64f1a2b3c4d5e6f789012345",
  "conversacionId": "64f1a2b3c4d5e6f789099999",
  "mensaje": "Salimos desde Buenos Aires, Argentina"
}
```

Si no se envía `conversacionId`, el servicio retoma automáticamente la última conversación en progreso de ese `usuarioId` en vez de crear una nueva.

Respuesta (mientras falta información):

```json
{
  "conversacionId": "64f1a2b3c4d5e6f789099999",
  "estado": "incompleto",
  "mensaje": "¿Desde qué ciudad viajarían?",
  "viaje": { "...": "perfil de viaje acumulado hasta el momento" },
  "camposFaltantesImportantes": ["lugarSalida.ciudad"],
  "preguntas": [
    {
      "campo": "lugarSalida",
      "pregunta": "¿Desde qué ciudad viajarían?",
      "motivo": "El punto de salida afecta considerablemente las opciones y el costo del viaje."
    }
  ]
}
```

Respuesta (cuando ya hay información suficiente):

```json
{
  "conversacionId": "64f1a2b3c4d5e6f789099999",
  "estado": "listoParaBuscar",
  "mensaje": "Ya tengo la información necesaria para buscar recomendaciones de viaje.",
  "viaje": { "...": "perfil de viaje completo" },
  "camposFaltantesImportantes": [],
  "preguntas": []
}
```

Una vez que una conversación llega a `estado: "listoParaBuscar"` queda marcada como `completo` y no acepta más mensajes (devuelve 409).

Obtener una conversación por id

GET /api/conversaciones/64f1a2b3c4d5e6f789099999

Variables de entorno necesarias: las mismas de Gemini (GEMINI_API_KEY, GEMINI_MODEL opcional).
