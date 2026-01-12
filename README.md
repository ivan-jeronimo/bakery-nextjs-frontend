# 🥖 Panadería La Espiga (Front-end)

Este es el repositorio del front-end para el sitio web de **Panadería La Espiga** (o Panciencia), desarrollado con **Next.js 15**, **React** y **Tailwind CSS**.

El proyecto está diseñado para ser rápido, modular y fácil de mantener, siguiendo las mejores prácticas de desarrollo moderno.

## 🚀 Tecnologías

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Iconos**: SVG y Flaticon (referenciados)
-   **Fuentes**: Geist Sans / Geist Mono (Google Fonts)

## 📂 Estructura del Proyecto

```bash
front-nextjs/
├── app/
│   ├── layout.tsx      # Layout global (Navbar, Footer, Fuentes)
│   ├── page.tsx        # Página de Inicio (Landing Page)
│   ├── globals.css     # Estilos globales y configuración de Tailwind
│   └── cotizaciones/   # Página de formulario de cotizaciones
│       └── page.tsx
├── components/         # Componentes reutilizables
│   ├── Navbar.tsx      # Barra de navegación superior
│   ├── Footer.tsx      # Pie de página
│   ├── HeroSection.tsx # Banner principal
│   ├── ProductSection.tsx # Sección de cuadrícula de productos
│   ├── HistorySection.tsx # Sección "Sobre Nosotros"
│   └── ... (otros componentes modulares)
├── public/             # Archivos estáticos (imágenes, favicon)
└── ...
```

## 🛠️ Instalación y Uso

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd front-nextjs
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Correr el servidor de desarrollo**:
    ```bash
    npm run dev
    # o
    yarn dev
    ```

4.  **Abrir en el navegador**:
    Visita [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🎨 Personalización

### Imágenes
Actualmente, el proyecto utiliza imágenes de **Unsplash** y **Placehold.co** como marcadores de posición.
Para usar tus propias imágenes:
1.  Guarda tus archivos `.jpg` o `.png` en la carpeta `public/images/`.
2.  Actualiza las rutas en los componentes (ej. `/images/mi-foto.jpg`).

### Colores
Los colores principales están definidos con clases de Tailwind:
-   **Ámbar/Marrón**: `text-amber-900`, `bg-amber-50`, `#E09900` (en estilos inline).
-   **Fondo**: `bg-white`, `bg-zinc-50`.

### Textos
Puedes editar los textos directamente en los archivos de componentes dentro de `components/` o en `app/page.tsx`.

## 📦 Despliegue

La forma más fácil de desplegar esta aplicación es usando [Vercel](https://vercel.com/):

1.  Sube tu código a GitHub.
2.  Importa el repositorio en Vercel.
3.  Vercel detectará automáticamente que es un proyecto Next.js y configurará el build.
4.  ¡Listo! Tu sitio estará online en minutos.

## 📄 Licencia

Este proyecto es de uso privado para Panadería La Espiga.
