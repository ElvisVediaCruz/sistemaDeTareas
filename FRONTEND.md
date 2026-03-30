# Frontend — Asignación de Tareas

**Stack:** React 18 + Vite + TypeScript + Ant Design 5 + SASS + Axios + Recharts
**Puerto:** 5173 (`npm run dev`)
**API base:** `http://localhost:3000/api` (proxy en vite.config.ts y `.env` → `VITE_API_URL`)
**Entry point:** `src/main.tsx` → `src/App.tsx`

---

## Roles de usuario

| `tipo` | Ruta post-login | Layout | Color sider |
|--------|----------------|--------|-------------|
| `administrador` | `/dashboard` | `AppLayout` | `#001529` (azul oscuro) |
| `encargado` | `/encargado/dashboard` | `EncargadoLayout` | `#006d75` (verde azulado) |
| `empleado` | `/empleado/tareas` | `EmpleadoLayout` | `#531dab` (morado) |

---

## Estructura de directorios

```
frontend/src/
├── main.tsx
├── App.tsx                          # todas las rutas agrupadas por rol
├── vite-env.d.ts
├── types/index.ts
├── api/
│   ├── axios.ts                     # JWT interceptor + 401 redirect + 403 toast
│   ├── auth.ts
│   ├── areas.ts
│   ├── empleados.ts
│   ├── proyectos.ts
│   ├── tareas.ts
│   ├── documentos.ts                # createDocumento usa FormData
│   └── areaProyectos.ts
├── context/AuthContext.tsx          # token + parseJwt + setAuth/logout
├── routes/PrivateRoute.tsx          # PrivateRoute | AdminRoute | EncargadoRoute | EmpleadoRoute
├── styles/
│   ├── _variables.scss
│   └── global.scss
├── components/Layout/
│   ├── AppLayout.tsx                # Admin layout (sider azul)
│   ├── EncargadoLayout.tsx          # Encargado layout (sider verde)
│   └── EmpleadoLayout.tsx           # Empleado layout (sider morado)
└── pages/
    ├── Login/Login.tsx              # redirige según tipo del JWT
    ├── Dashboard/Dashboard.tsx      # Admin dashboard
    ├── Areas/Areas.tsx
    ├── Empleados/Empleados.tsx
    ├── Proyectos/Proyectos.tsx
    ├── Tareas/Tareas.tsx
    ├── Documentos/Documentos.tsx    # Upload con FormData
    ├── AreaProyectos/AreaProyectos.tsx
    ├── Encargado/
    │   ├── Dashboard.tsx            # stats del área + 2 charts
    │   ├── Proyectos.tsx            # proyectos del área, solo edita estado
    │   ├── Empleados.tsx            # equipo del área, solo lectura
    │   ├── Tareas.tsx               # CRUD tareas del área, asigna empleados
    │   └── Documentos.tsx           # docs del área, solo ver + eliminar
    └── Empleado/
        ├── MisTareas.tsx            # solo ver + actualizar estado
        └── MisDocumentos.tsx        # CRUD documentos propios
```

---

## Rutas y guards

```
/login                       → público
/dashboard                   → AdminRoute    → AppLayout
/areas                       → AdminRoute    → AppLayout
/empleados                   → AdminRoute    → AppLayout
/proyectos                   → AdminRoute    → AppLayout
/tareas                      → AdminRoute    → AppLayout
/documentos                  → AdminRoute    → AppLayout
/area-proyectos              → AdminRoute    → AppLayout
/encargado/dashboard         → EncargadoRoute → EncargadoLayout
/encargado/proyectos         → EncargadoRoute → EncargadoLayout
/encargado/empleados         → EncargadoRoute → EncargadoLayout
/encargado/tareas            → EncargadoRoute → EncargadoLayout
/encargado/documentos        → EncargadoRoute → EncargadoLayout
/empleado/tareas             → EmpleadoRoute  → EmpleadoLayout
/empleado/documentos         → EmpleadoRoute  → EmpleadoLayout
*                            → /login
```

### Guards (`src/routes/PrivateRoute.tsx`)
| Guard | Condición | Redirect si falla |
|-------|-----------|-------------------|
| `PrivateRoute` | token presente | `/login` |
| `AdminRoute` | token + tipo === `administrador` | `/login` |
| `EncargadoRoute` | token + tipo === `encargado` | `/login` |
| `EmpleadoRoute` | token + tipo === `empleado` | `/login` |

---

## Autenticación

- JWT RS256 guardado en `localStorage["token"]`
- `parseJwt(token)` decodifica payload: `{ id, usuario, tipo, id_area }`
- Post-login redirect por `tipo`:
  - `administrador` → `/dashboard`
  - `encargado` → `/encargado/dashboard`
  - `empleado` → `/empleado/tareas`
- Axios interceptors: 401 → limpia token + redirect `/login` | 403 → `message.error`

---

## Tipos TypeScript (`src/types/index.ts`)

```ts
Area          { id_area, nombre }
Employee      { id_empleado, nombre, apellido, edad?, usuario, password?,
                cargo, tipo?, id_area?, id_jefe?, area?, subordinados?, jefe? }
               tipo: "administrador" | "encargado" | "empleado"
Proyecto      { id_proyecto, nombre, fecha_inicio, fecha_entrega, estado }
AreaProyecto  { id_area_proyecto, id_area, id_proyecto, area?, proyecto? }
Tarea         { id_tarea, nombre, fecha_entrega?, estado?, id_proyecto?,
                id_empleado?, proyecto?, empleado?, documentos? }
Documento     { id_documento, nombre, url, fecha?, id_tarea?, tarea? }
AuthPayload   { id, usuario, tipo, id_area }
LoginResponse { token }
RegisterBody  { id_empleado, nombre, apellido, edad?, usuario, password,
                cargo, tipo?, id_area?, id_jefe? }
```

---

## API modules (`src/api/`)

### `documentos.ts`
`createDocumento(nombre, id_tarea, archivo: File)` → envía `FormData` con campos `nombre`, `id_tarea`, `archivo`

### Notas de acceso por rol
El servidor filtra automáticamente según el JWT:
- `getTareas()` → admin: todos | encargado: su área | empleado: los suyos
- `getDocumentos()` → admin: todos | encargado: su área | empleado: los suyos
- `getProyecto(id)` → admin + encargado (empleado no tiene acceso)
- `getAreaProyectos()` → admin + encargado

---

## Páginas — Administrador

Todas las páginas del admin tienen CRUD completo según el backend. Ver sección anterior.

---

## Páginas — Encargado

### `Encargado/Dashboard` (`/encargado/dashboard`)
- **Datos cargados:**
  - `getEmpleadosPorArea(id_area)` → count empleados
  - `getAreaProyectos()` + filtro client-side + `getProyecto(id)` por cada uno
  - `getTareas()` → filtrado server-side por área
  - `getDocumentos()` → filtrado server-side por área
- **4 stat cards**: empleados, proyectos, tareas, documentos
- **BarChart**: tareas por estado
- **PieChart**: proyectos por estado

### `Encargado/Proyectos` (`/encargado/proyectos`)
- Carga proyectos de su área: `getAreaProyectos()` → filtrar `id_area` → `getProyecto(id)` para cada uno
- **Solo puede editar el estado** (modal con un campo Select de estado)
- No puede crear ni eliminar proyectos

### `Encargado/Empleados` (`/encargado/empleados`)
- `getEmpleadosPorArea(id_area)` → tabla solo lectura
- Columnas: ID, nombre, usuario, cargo, tipo (Tag)
- Sin acciones de edición

### `Encargado/Tareas` (`/encargado/tareas`)
- `getTareas()` → filtrado server-side por área
- **CRUD completo**: crear, editar, eliminar
- Al crear/editar: seleccionar proyecto (de su área) + empleado (de su área)
- Carga proyectos de su área vía área-proyectos + carga empleados de su área

### `Encargado/Documentos` (`/encargado/documentos`)
- `getDocumentos()` → filtrado server-side por área
- Columnas: ID, nombre, archivo (link), fecha, tarea (Tag), empleado
- Solo puede **eliminar** (no puede crear)
- La columna "Empleado" usa `record.tarea?.empleado` del include del backend

---

## Páginas — Empleado

### `Empleado/MisTareas` (`/empleado/tareas`)
- `getTareas()` → filtrado server-side solo sus tareas
- **Solo puede actualizar el estado** (modal con Select)
- No puede crear ni eliminar tareas
- Columnas: ID, nombre, fecha entrega, estado (Tag), cantidad de documentos

### `Empleado/MisDocumentos` (`/empleado/documentos`)
- `getDocumentos()` → filtrado server-side solo sus documentos
- **CRUD completo**: subir + eliminar
- Al subir: selecciona una de sus tareas (lista cargada con `getTareas()`)
- Columna "Tarea" usa `record.tarea?.nombre` del include del backend (fallback a tareas locales)

---

## Layouts

### `AppLayout` (Admin)
- Sider `#001529` azul oscuro, 220px
- Menú: Dashboard, Áreas, Empleados, Proyectos, Tareas, Documentos, Área-Proyectos

### `EncargadoLayout`
- Sider `#006d75` verde azulado, 220px
- Menú: Dashboard, Proyectos, Mi Equipo, Tareas, Documentos

### `EmpleadoLayout`
- Sider `#531dab` morado, 220px
- Menú: Mis Tareas, Mis Documentos

Los tres layouts tienen Header con botón colapsar + avatar + dropdown logout.

---

## Dependencias

| Paquete | Versión |
|---------|---------|
| react | ^18.3.1 |
| react-dom | ^18.3.1 |
| react-router-dom | ^6.28.0 |
| antd | ^5.21.0 |
| @ant-design/icons | ^5.4.0 |
| axios | ^1.7.9 |
| recharts | ^2.13.3 |
| sass | ^1.83.0 |
| vite | ^6.0.5 |
| typescript | ^5.7.2 |

---

## Notas importantes

- `dayjs` incluido con Ant Design — no instalar por separado
- `additionalData` de Vite SCSS: `@use "./variables" as *;` (ruta relativa)
- `id_empleado` no es autoincrement — se ingresa manualmente al crear (solo admin)
- Axios: 401 → redirect `/login` | 403 → toast error sin redirect
- Los proyectos del encargado se obtienen vía N+1: `getAreaProyectos()` → filtrar → `getProyecto(id)` por cada uno
- El servidor usa Sequelize `include` en `findByArea`/`findByEmpleado`, por lo que documentos devueltos pueden contener `tarea` poblado
- Archivos subidos disponibles en `http://localhost:3000/uploads/<filename>`
- Proxy de Vite: `/api/*` → `localhost:3000` (evita CORS en dev)
