# Componente RelatedProducts

## Descripción

Componente que muestra productos relacionados en la página de detalles de producto. Utiliza un carousel (Swiper) para mostrar productos que compartan una o más categorías con el producto actual, de forma responsive.

## Características

- 📱 **Responsive**: Adapta el número de productos mostrados según el tamaño de pantalla
- 🔄 **Carousel dinámico**: Usa Swiper con navegación y paginación
- 🎯 **Basado en múltiples categorías**: Obtiene productos relacionados que compartan CUALQUIERA de las categorías del producto actual
- ⚡ **Cargamiento eficiente**: Petición API optimizada con límite configurable
- 🎨 **Estilizado**: Estilos personalizados para el carousel

## Props

```javascript
{
  productId: String,      // ID del producto actual (requerido)
  categories: Array,      // Array de IDs de categorías (requerido)
  limit: Number           // Cantidad máxima de productos a mostrar (default: 8)
}
```

## Uso

### En ProductDetailPage:

```jsx
import RelatedProducts from "../components/RelatedProducts/RelatedProducts";

// Dentro del JSX
{
  product.categories && product.categories.length > 0 && (
    <RelatedProducts
      productId={productId}
      categories={product.categories.map((cat) => cat._id || cat)}
      limit={8}
    />
  );
}
```

## Requisitos Backend

### Endpoint: `GET /products/related/:id`

**Parámetros:**

- `:id` - ID del producto actual (en la URL)
- `categories` - IDs de categorías separadas por comas o array (query param)
- `limit` - Número máximo de productos (query param, default: 8)

**Ejemplo de uso:**

```
GET /products/related/product-123?categories=cat1,cat2,cat3&limit=8
```

**Respuesta:**
Array de productos relacionados con la estructura de:

```javascript
[
  {
    _id: ObjectId,
    title: String,
    description: String,
    price: Number,
    images: Array<String>,
    categories: Array<{ _id, name }>,
    storeId: {
      name: String,
      slug: String,
      logo: String
    },
    ...
  },
  // ... más productos
]
```

## Lógica de búsqueda

- El componente busca productos que compartan **CUALQUIERA** de las categorías del producto actual ($in)
- Excluye el producto actual de los resultados
- Excluye productos eliminados (con `deletedAt`)
- Limita el resultado al número especificado

## Dependencias

- `react`
- `@heroui/react` - Para componentes UI (Spinner, Card)
- `swiper` - Para el carousel
- `../../services/api` - Función `getRelatedProducts`
- `../ListElement/ListElement` - Componente para renderizar cada producto

## Estados

- `relatedProducts` - Array de productos relacionados
- `loading` - Estado de carga
- `error` - Mensaje de error si aplica

## Breakpoints Responsive (Swiper)

- **Mobile** (< 640px): 1 producto por pantalla
- **Tablet pequeño** (640px - 768px): 2 productos
- **Tablet** (768px - 1024px): 3 productos
- **Desktop** (1024px+): 4 productos

## Estilos CSS

Los estilos están en `RelatedProducts.css` y personalizan:

- Botones de navegación
- Indicadores de paginación
- Spacing y overflow del slide
- Colores y efectos hover

## Manejo de errores

El componente maneja gracefully:

- Productos no encontrados
- Errores de API
- Sin categorías válidas
- Sin productos relacionados disponibles
- Estado de cargando

## Notas

- La ruta del endpoint en backend debe colocarse ANTES de `GET /products/product/:id` en el router para evitar conflictos
- El componente espera un array de ObjectIds válidos
- Si el producto no tiene categorías, el componente no se renderiza
- La búsqueda es sensible a categorías compartidas (usa $in para ANY match)
