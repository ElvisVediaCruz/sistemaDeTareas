# Backend — Asignación de Tareas

**Stack:** Node.js + TypeScript + Express 5 + Sequelize 6 + MySQL
**Puerto:** 3000 (`.env` → `PORT`)
**DB:** `tareas` (MySQL, host localhost, user root)
**Entry point:** `server.ts` → `src/app.ts`
**Dev:** `npm run dev` (ts-node-dev con hot reload)

---

## Estructura de directorios

```
backend/
├── keys/
│   ├── private.pem          # Clave privada RSA 2048 (firma JWT)
│   └── public.pem           # Clave pública RSA (verifica JWT)
├── src/
│   ├── app.ts               # Express app + registro de rutas
│   ├── config/
│   │   └── database.ts      # Sequelize connection (instancia: sequelize)
│   ├── models/
│   │   ├── Area.model.ts         → clase: Area
│   │   ├── Empleado.model.ts     → clase: Employee
│   │   ├── Proyecto.model.ts     → clases: Proyecto, AreaProyecto
│   │   ├── Tarea.model.ts        → clase: Tarea
│   │   ├── Documento.model.ts    → clase: Documento
│   │   ├── associations.ts       → función: applyAssociations()
│   │   └── Index.ts              → re-exports de modelos
│   ├── services/
│   │   ├── Base.service.ts       → clase: BaseService<T>
│   │   ├── Auth.service.ts       → clase: AuthService
│   │   ├── Area.service.ts       → clase: AreaService
│   │   ├── Employee.service.ts   → clase: EmployeeService
│   │   ├── Project.service.ts    → clase: ProjectService
│   │   ├── Task.service.ts       → clase: TareaService
│   │   ├── Document.service.ts   → clase: DocumentService
│   │   └── AreaProyect.service.ts → clase: AreaProyectService
│   ├── controllers/
│   │   ├── Auth.controller.ts
│   │   ├── Area.controller.ts
│   │   ├── Employee.controller.ts
│   │   ├── Project.controller.ts
│   │   ├── Tarea.controller.ts
│   │   ├── Document.controller.ts
│   │   └── AreaProject.controllers.ts
│   ├── routes/
│   │   ├── Auth.routes.ts
│   │   ├── Area.routes.ts
│   │   ├── Employee.routes.ts
│   │   ├── Project.routes.ts
│   │   ├── Tarea.routes.ts
│   │   ├── Document.routes.ts
│   │   └── AreaProject.routes.ts
│   └── middlewares/
│       └── auth.middleware.ts    → verifyToken (Express middleware)
|       └── multer.midleware.ts     read document (Express midleware)
├── .env
├── .gitignore                    # ignora: node_modules, dist, .env, keys/
├── server.ts
├── tsconfig.json
└── package.json
```

---

## Modelos

### Area
| Campo    | Tipo    | Notas              |
|----------|---------|--------------------|
| id_area  | INTEGER | PK, autoincrement  |
| nombre   | STRING  | NOT NULL           |

### Employee
| Campo       | Tipo    | Notas                  |
|-------------|---------|------------------------|
| id_empleado | INTEGER | PK                     |
| nombre      | STRING  | NOT NULL               |
| apellido    | STRING  | NOT NULL               |
| edad        | INTEGER |                        |
| usuario     | STRING  | UNIQUE, NOT NULL       |
| password    | STRING  | NOT NULL (bcrypt hash) |
| cargo       | STRING  | NOT NULL               |
| tipo        | STRING  |                        |
| id_area     | INTEGER | FK → Area              |
| id_jefe     | INTEGER | FK → Employee (null = jefe) |

### Proyecto
| Campo         | Tipo   | Notas     |
|---------------|--------|-----------|
| id_proyecto   | INTEGER | PK, autoincrement |
| nombre        | STRING  | NOT NULL  |
| fecha_inicio  | DATE    | NOT NULL  |
| fecha_entrega | DATE    | NOT NULL  |
| estado        | STRING  | NOT NULL  |

### AreaProyecto (tabla join)
| Campo           | Tipo    | Notas              |
|-----------------|---------|--------------------|
| id_area_proyecto| INTEGER | PK, autoincrement  |
| id_area         | INTEGER | FK → Area          |
| id_proyecto     | INTEGER | FK → Proyecto      |

### Tarea
| Campo         | Tipo    | Notas           |
|---------------|---------|-----------------|
| id_tarea      | INTEGER | PK, autoincrement |
| nombre        | STRING  | NOT NULL        |
| fecha_entrega | DATE    |                 |
| estado        | STRING  |                 |
| id_proyecto   | INTEGER | FK → Proyecto   |
| id_empleado   | INTEGER | FK → Employee   |

### Documento
| Campo       | Tipo    | Notas         |
|-------------|---------|---------------|
| id_documento| INTEGER | PK, autoincrement |
| nombre      | STRING  | NOT NULL      |
| url         | STRING  | NOT NULL      |
| fecha       | DATE    |               |
| id_tarea    | INTEGER | FK → Tarea    |

---

## Asociaciones (associations.ts)

| Relación | Tipo | FK | Alias |
|---|---|---|---|
| Area → Employee | hasMany | id_area | `empleados` |
| Employee → Area | belongsTo | id_area | `area` |
| Employee → Employee | hasMany | id_jefe | `subordinados` |
| Employee → Employee | belongsTo | id_jefe | `jefe` |
| Tarea → Documento | hasMany | id_tarea | `documentos` |
| Documento → Tarea | belongsTo | id_tarea | `tarea` |
| Proyecto → Tarea | hasMany | id_proyecto | — |
| Tarea → Proyecto | belongsTo | id_proyecto | `proyectos` |
| Area → AreaProyecto | hasMany | id_area | `areasproyectos` |
| Proyecto → AreaProyecto | hasMany | id_proyecto | — |
| AreaProyecto → Proyecto | belongsTo | id_proyecto | — |
| AreaProyecto → Area | belongsTo | id_area | — |
| Employee → Tarea | hasMany | id_empleado | — |
| Tarea → Employee | belongsTo | id_empleado | — |

---

## Services

### BaseService\<T\>
Todos los services extienden este. Métodos disponibles en todos:
```
create(data)          → crea registro
fUpdate(data, id)     → actualiza por PK (lanza Error si no existe)
delete(id)            → elimina por PK (lanza Error si no existe)
findAll()             → todos los registros
find(id)              → uno por PK (lanza Error si no existe)
```

### AuthService (`Auth.service.ts`)
```
hashPassword(password)                  → string (bcrypt, salt 10)
register(data)                          → Employee (password encriptado)
login(usuario, password)                → string JWT (RS256, expira 8h)
verifyToken(token)                      → payload decodificado
```
- Lee `keys/private.pem` y `keys/public.pem` al iniciar
- JWT payload: `{ id, usuario, tipo, id_area }`

### EmployeeService (`Employee.service.ts`)
```
functionEmployeeArea(id_area)           → empleados del area con include: Area (as: "areas")
funtionHeadArea(id_area)                → jefe del area (id_jefe null) con include: subordinados
functionHeads()                         → todos los jefes con subordinados y area
```

### ProjectService (`Project.service.ts`)
```
functionAlert(time)                     → proyectos con fecha_entrega en los próximos N días
functionAlertProyectArea(id_area, time) → igual pero filtrado por area (include: Area)
functionProjectDelay(estado, id_area)   → proyectos con ese estado en esa area
```

### AreaService, TareaService, DocumentService, AreaProyectService
Solo heredan BaseService, sin métodos adicionales.

---

## Rutas API

Base URL: `http://localhost:3000/api`

### Auth — `/api/auth`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/register` | Crear empleado (password hasheado, responde sin password) | No |
| POST | `/login` | Login → `{ token }` | No |

**Body login:** `{ "usuario": "...", "password": "..." }`

### Areas — `/api/areas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todas las áreas |
| GET | `/:id` | Una área |
| POST | `/` | Crear área |
| PUT | `/:id` | Actualizar área |
| DELETE | `/:id` | Eliminar área |

### Empleados — `/api/empleados`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todos los empleados |
| GET | `/jefes` | Todos los jefes con subordinados y área |
| GET | `/area/:id_area` | Empleados de un área |
| GET | `/jefe/area/:id_area` | Jefe de un área con sus subordinados |
| GET | `/:id` | Un empleado |
| POST | `/` | Crear empleado |
| PUT | `/:id` | Actualizar empleado |
| DELETE | `/:id` | Eliminar empleado |

> **Importante:** Las rutas estáticas (`/jefes`, `/area/:id_area`, `/jefe/area/:id_area`) van ANTES de `/:id` para evitar conflictos.

### Proyectos — `/api/proyectos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todos los proyectos |
| GET | `/alerta/:time` | Proyectos con entrega en los próximos N días |
| GET | `/alerta/area/:id_area/:time` | Ídem filtrado por área |
| GET | `/retraso/area/:id_area?estado=` | Proyectos por estado en un área |
| GET | `/:id` | Un proyecto |
| POST | `/` | Crear proyecto |
| PUT | `/:id` | Actualizar proyecto |

### Tareas — `/api/tareas`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todas las tareas |
| GET | `/:id` | Una tarea |
| POST | `/` | Crear tarea |
| PUT | `/:id` | Actualizar tarea |
| DELETE | `/:id` | Eliminar tarea |

### Documentos — `/api/documentos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todos los documentos |
| GET | `/:id` | Un documento |
| POST | `/` | Crear documento |
| DELETE | `/:id` | Eliminar documento |

### Area-Proyectos — `/api/area-proyectos`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Todas las relaciones |
| GET | `/:id` | Una relación |
| POST | `/` | Crear relación area-proyecto |
| DELETE | `/:id` | Eliminar relación |

---

## Middleware de autenticación

**Archivo:** `src/middlewares/auth.middleware.ts`
**Función:** `verifyToken`

Uso en cualquier route:
```ts
import { verifyToken } from "../middlewares/auth.middleware";

router.get("/", verifyToken, getAreas);
```

Header requerido:
```
Authorization: Bearer <token>
```

El payload queda disponible en `(req as any).user` con `{ id, usuario, tipo, id_area }`.

---

## Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| express | ^5.2.1 | Framework HTTP |
| sequelize | ^6.37.8 | ORM |
| mysql2 | ^3.20.0 | Driver MySQL |
| dotenv | ^17.3.1 | Variables de entorno |
| cors | ^2.8.6 | CORS middleware |
| jsonwebtoken | — | JWT RS256 |
| bcrypt | — | Hash de contraseñas |
| @types/cors | ^2.8.19 | |
| @types/express | ^5.0.6 | |
| @types/jsonwebtoken | — | |
| @types/bcrypt | — | |
| @types/node | ^25.5.0 | |
| typescript | ^6.0.2 | |
| ts-node-dev | ^2.0.0 | Dev server hot reload |

---

## Variables de entorno (.env)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=8817891
DB_NAME=tareas
```

---

## Notas importantes

- `keys/` está en `.gitignore` — nunca commitear las claves privadas
- El `id_empleado` **no es autoincrement** en el modelo (se pasa manualmente)
- `id_jefe = null` identifica a los jefes de área
- Al hacer `register`, la respuesta excluye el campo `password`
- El service `funtionHeadArea` tiene un typo intencional en el nombre (sin 'c') — respetar al importar
- `AreaProyecto` se importa desde `Proyecto.model.ts`, no tiene modelo propio
