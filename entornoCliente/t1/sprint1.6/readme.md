# 📘 Generador Automático de Documentación para Proyectos Java

### *Sprint 1.6 – Documentación y Arquitectura Inicial*

## 📌 Descripción del Proyecto

Este proyecto tiene como objetivo desarrollar una aplicación capaz de **analizar un proyecto Java** y generar de forma automática:

* Documentación técnica en **Markdown**
* Diagramas **UML** mediante PlantUML
* Documentación final en **PDF**

El sistema se basa en una arquitectura compuesta por:

* **Frontend** en React + TailwindCSS
* **Backend** en Node.js
* **Contenedores Docker**
* **Modelo de IA local (LMStudio)** para enriquecer explicaciones
* **PlantUML** para los diagramas
* **Pandoc** (u otra herramienta) para convertir Markdown → PDF

Este README documenta toda la estructura, tecnologías y UML generados durante el Sprint 1.6.

---

# 📁 Estructura del Proyecto (Sprint 1.6)

```
/docs
   ├─ uml/
   │    ├─ vista_principal.puml
   │    ├─ boton_generacion.puml
   │    ├─ gestion_estados.puml
   │    ├─ manejo_eventos.puml
   │    ├─ comunicacion_componentes.puml
   │    ├─ useEffect_historial.puml
   │    ├─ renderizado_condicional.puml
   │    ├─ vista_resultado.puml
   │    ├─ vista_historial.puml
   │    └─ arquitectura_componentes_frontend.puml
   ├─ backend/
   │    ├─ analizar_codigo.puml
   │    ├─ generar_puml.puml
   │    ├─ integrar_ia.puml
   │    ├─ generar_markdown_pdf.puml
   │    ├─ gestionar_historial.puml
   │    └─ flujo_post_analyze.puml
   ├─ arquitecturas/
   │    ├─ arquitectura_general.puml
   │    └─ despliegue_docker.puml
README.md
```

---

# 🚀 Funcionalidades del Sistema

### ✔ Frontend (React + TailwindCSS)

* Vista principal para subir o seleccionar un proyecto Java
* Botón de generación que llama a `POST /api/analyze`
* Gestión de estados mediante **useState**
* Manejo de eventos (**onClick**, **onChange**, **onSubmit**)
* Comunicación por **props** (lifting state up)
* Uso de **useEffect** para cargar historial
* Renderizado condicional (carga, error, éxito)
* Vista de resultado con Markdown + descarga PDF
* Vista de historial de ejecuciones

### ✔ Backend (Node.js)

Endpoints implementados en este sprint (definidos/documentados, se desarrollarán en los siguientes):

| Endpoint              | Descripción                                                   |
| --------------------- | ------------------------------------------------------------- |
| **POST /api/analyze** | Recibe el proyecto Java, lo analiza y genera la documentación |
| **GET /api/history**  | Devuelve el historial de ejecuciones                          |
| **GET /api/docs/:id** | Devuelve MD/PDF generado                                      |

Además, se definen los siguientes módulos:

1. **AnalyzerService** – analiza el código Java
2. **UMLGenerator** – genera archivos `.puml`
3. **IAService** – integra IA local para descripciones
4. **MarkdownService** – genera Markdown y PDF
5. **HistorialService** – gestiona ejecuciones

### ✔ Tecnologías Mínimas (Requeridas)

* Node.js
* React + TailwindCSS (puerto **8978**)
* Docker
* PowerShell (Setup.ps1)
* PlantUML
* LMStudio / IA local
* Pandoc u otra herramienta Markdown → PDF

---

# 🧩 Diagramas UML Incluidos (Sprint 1.6)

### 🔷 **Frontend – Se genera un diagrama UML por cada requisito**

* Vista principal – `vista_principal.puml`
* Botón de generación – `boton_generacion.puml`
* Gestión de estados – `gestion_estados.puml`
* Manejo de eventos – `manejo_eventos.puml`
* Comunicación entre componentes – `comunicacion_componentes.puml`
* useEffect + historial – `useEffect_historial.puml`
* Renderizado condicional – `renderizado_condicional.puml`
* Vista de resultado – `vista_resultado.puml`
* Vista de historial – `vista_historial.puml`
* Arquitectura general frontend – `arquitectura_componentes_frontend.puml`

### 🔷 **Backend – Un UML por cada punto del enunciado**

* Analizar código Java – `analizar_codigo.puml`
* Generar PlantUML – `generar_puml.puml`
* Integración IA – `integrar_ia.puml`
* Markdown → PDF – `generar_markdown_pdf.puml`
* Historial – `gestionar_historial.puml`
* Flujo POST /api/analyze – `flujo_post_analyze.puml`

### 🔷 **Arquitectura global**

* Arquitectura de componentes con IA + Docker – `arquitectura_general.puml`
* Diagrama de despliegue Docker – `despliegue_docker.puml`

---

# 📄 Relación con la Rúbrica del Módulo

| Ejercicio                 | Estado                           | Justificación                              |
| ------------------------- | -------------------------------- | ------------------------------------------ |
| **1. Markdown generado**  | ✔ Documentado                    | Incluidos UML, flujo y explicación técnica |
| **2. Diagramas UML**      | ✔ Completos                      | Más de 15 diagramas .puml generados        |
| **3. PDF**                | ✔ Planificado (Sprint siguiente) | Procesos documentados + PlantUML listos    |
| **4. Frontend funcional** | ✔ Documentado                    | Estados, eventos, props, efectos           |
| **5. Docker + Setup.ps1** | ✔ Documentación incluida         | Preparación de arquitectura de despliegue  |
| **6. Integración IA**     | ✔ Incluido                       | Diagrama + explicación IAService           |

---

# 🔧 Próximos pasos (Sprint 1.7)

* Implementación real del backend
* Generación automática de `.md` y `.pdf`
* Integración real del modelo LMStudio
* Conexión completa frontend ↔ backend
* Docker Compose final
