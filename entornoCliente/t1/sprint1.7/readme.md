# Generador de Documentos Java — Guía rápida

## Resumen
Herramienta para analizar proyectos Java y generar documentación técnica (Markdown, PlantUML, PDF). Backend en Node.js/Express, frontend en React (Vite). Docker-ready.

## Requisitos

- Docker y Docker Compose
- Node.js (para desarrollo local sin contenedores)

## Instrucciones rápidas (Docker)

```
# desde la raíz del proyecto
docker compose build
docker compose up -d
# ver servicios
docker compose ps
# logs
docker compose logs -f backend
```

## Flujo de uso

1. Abrir la UI en el navegador.
2. Subir un ZIP con el proyecto Java.
3. Pulsar `Analyze` y esperar a que termine.
4. Ir a `History` y descargar los artefactos o previsualizar Markdown.

## Archivos importantes

- `backend/` — servidor, analizadores, generadores, datos.
- `frontend/` — React + Vite UI.
- `docker-compose.yml` — orquestación de servicios.

## Limpieza aplicada

- Eliminados logs de depuración en `backend/src/controllers/docs.controller.js`.
- Añadido `.gitignore` en la raíz para evitar subir `node_modules`, `outputs`, `data/history.json`, etc.
- Añadida carpeta `images/` para colocar screenshots y GIFs.

## Placeholders para imágenes

- Imagen del terminal con contenedores Docker funcionando:

![Docker containers running](images/dockerCorriendo.png)

- GIF del proceso (subida → análisis → descarga):

![Process GIF](images/videoResultado.gif)

## Siguientes pasos recomendados

- Revisar los scripts en `backend/scripts/` y eliminar o documentar los que sean de utilidad.
- Añadir tests de integración para endpoints de descarga.
- (Opcional) Consolidar imports y mover los módulos a una estructura monorepo más explícita si se prefieren subpaquetes.
