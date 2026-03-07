# PartnerLooking Frontend

Frontend en Next.js para PartnerLooking.

## Backend conectado

El frontend ya está preparado para consumir tu backend desplegado:

- `NEXT_PUBLIC_API_URL=https://partnerlooking-backend.onrender.com`

Endpoints de auth usados por defecto:

- `NEXT_PUBLIC_AUTH_LOGIN_PATH=/auth/login`
- `NEXT_PUBLIC_AUTH_REGISTER_PATH=/auth/register`

Puedes cambiar las rutas si tu API usa otros paths.

## Correr en local

1. Instala dependencias:

```bash
npm install
```

2. Crea archivo de entorno desde el ejemplo:

```bash
cp .env.example .env.local
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env.local
```

3. Inicia el servidor:

```bash
npm run dev
```

4. Abre:

- `http://localhost:3000`
- `http://localhost:3000/vistas/login`
- `http://localhost:3000/vistas/registro`

## Deploy en Vercel

1. Importa el repo en Vercel.
2. En `Settings > Environment Variables`, agrega:

- `NEXT_PUBLIC_API_URL` = `https://partnerlooking-backend.onrender.com`
- `NEXT_PUBLIC_AUTH_LOGIN_PATH` = `/auth/login` (opcional)
- `NEXT_PUBLIC_AUTH_REGISTER_PATH` = `/auth/register` (opcional)

3. Redeploy.

Con eso el frontend queda desplegado y conectado al backend.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm start
```
