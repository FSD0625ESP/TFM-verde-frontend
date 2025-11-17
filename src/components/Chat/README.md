# Sistema de Chat con Socket.IO - Instrucciones de uso

## 🚀 Configuración inicial

### 1. Instalar dependencias

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 2. Backend - Ejecutar el seed de chats

Primero, asegúrate de haber ejecutado el seed de tiendas:

```bash
cd backend
node seeds/stores.js
```

Luego, ejecuta el seed de chats para crear conversaciones de prueba:

```bash
node seeds/chats.js
```

Esto creará:

- 5 usuarios clientes de prueba (customer1@example.com a customer5@example.com)
- Conversaciones entre clientes y tiendas
- Mensajes de ejemplo con diferentes templates

### 2. Usuarios de prueba

**Clientes:**

- Email: `customer1@example.com` - Password: `Customer123@`
- Email: `customer2@example.com` - Password: `Customer123@`
- Email: `customer3@example.com` - Password: `Customer123@`

**Vendedores:**

- Email: `seller1@example.com` - Password: `Seller123@`
- Email: `seller2@example.com` - Password: `Seller123@`

## 💬 Características del Chat con Socket.IO

### Tiempo Real ⚡

- **Mensajes instantáneos**: Los mensajes se entregan inmediatamente sin necesidad de recargar
- **Indicador de "escribiendo..."**: Muestra cuando el otro usuario está escribiendo
- **Notificaciones en tiempo real**: Badge actualizado automáticamente
- **Sincronización automática**: Todos los dispositivos conectados se sincronizan

### Componentes principales:

1. **ChatToggler** - Botón flotante inferior derecho

   - Muestra/oculta el chat
   - Badge con contador de mensajes no leídos (pendiente implementar)
   - Animación de pulso cuando hay mensajes nuevos

2. **ChatsDropdown** - Lista de conversaciones

   - Buscador de conversaciones
   - Lista de chats activos con:
     - Avatar del usuario
     - Nombre del usuario y tienda
     - Último mensaje
     - Hora del último mensaje
     - Badge de mensajes no leídos (pendiente)

3. **ChatContainer** - Ventana de conversación

   - Historial de mensajes agrupados por fecha
   - Input para enviar mensajes
   - Scroll automático al último mensaje
   - Indicador de envío
   - **Mensajes en tiempo real con Socket.IO**
   - **Indicador de "escribiendo..." (implementado)**

4. **SocketContext** - Gestión de Socket.IO
   - Conexión automática al autenticarse
   - Reconexión automática si se pierde la conexión
   - Eventos de mensajes en tiempo real
   - Gestión de salas de chat

### Arquitectura Socket.IO:

**Backend:**

- Autenticación vía JWT en handshake
- Salas por chat (`chat:${chatId}`)
- Eventos:
  - `join_chats`: Unirse a múltiples chats
  - `send_message`: Enviar mensaje
  - `new_message`: Recibir mensaje (broadcast)
  - `typing`: Usuario escribiendo
  - `stop_typing`: Usuario dejó de escribir
  - `mark_as_read`: Marcar como leído

**Frontend:**

- SocketContext con hooks personalizados
- Conexión automática al login
- Desconexión automática al logout
- Listeners de eventos en tiempo real

### Flujo de uso:

1. **Iniciar sesión** como cliente o vendedor
2. **Ver conversaciones** - Click en el botón flotante (💬)
3. **Seleccionar chat** - Click en cualquier conversación
4. **Enviar mensajes** - Escribe y presiona Enter o click en enviar
5. **Navegar** - Usa las flechas para volver a la lista o cerrar

## 🎨 Diseño inspirado en LinkedIn

- **Botón flotante**: Siempre visible en la esquina inferior derecha
- **Sidebar de chats**: Se abre desde la derecha, 400px de ancho
- **Ventanas de chat**: Se apilan a la izquierda del sidebar
- **Colores**: Gradientes primary/secondary para headers
- **Animaciones**: Transiciones suaves con Framer Motion

## 🔧 API Endpoints

### GET `/chats`

Obtiene todos los chats del usuario autenticado

### GET `/chats/:chatId`

Obtiene un chat específico con todos los mensajes

### GET `/chats/store/:storeId`

Obtiene o crea un chat con una tienda específica

### POST `/chats/:chatId/messages`

Envía un mensaje en un chat (también funciona vía Socket.IO)

```json
{
  "text": "Hola, me interesa este producto"
}
```

### Socket.IO Events

**Cliente → Servidor:**

```javascript
// Unirse a chats
socket.emit("join_chats", [chatId1, chatId2]);

// Enviar mensaje
socket.emit("send_message", { chatId, text: "Hola!" });

// Indicar que está escribiendo
socket.emit("typing", { chatId });
socket.emit("stop_typing", { chatId });

// Marcar como leído
socket.emit("mark_as_read", { chatId });
```

**Servidor → Cliente:**

```javascript
// Nuevo mensaje
socket.on("new_message", (data) => {
  // data: { chatId, message: { _id, text, senderId, timestamp } }
});

// Usuario escribiendo
socket.on("user_typing", (data) => {
  // data: { chatId, userId, userEmail }
});

// Usuario dejó de escribir
socket.on("user_stop_typing", (data) => {
  // data: { chatId, userId }
});

// Mensajes leídos
socket.on("messages_read", (data) => {
  // data: { chatId, userId }
});

// Error
socket.on("error", (error) => {
  // error: { message: 'Descripción del error' }
});
```

### DELETE `/chats/:chatId`

Elimina (soft delete) un chat

## 📝 Características implementadas

- [x] Mensajes en tiempo real con Socket.IO
- [x] Autenticación de sockets vía JWT
- [x] Salas de chat individuales
- [x] Broadcast de mensajes a todos los participantes
- [x] Indicador de "escribiendo..." (backend listo)
- [x] Reconexión automática
- [x] Lista de chats actualizada en tiempo real
- [x] Scroll automático a nuevos mensajes
- [x] UI inspirada en LinkedIn

## 📝 Próximas mejoras

- [ ] Contador real de mensajes no leídos
- [ ] Mostrar indicador visual de "escribiendo..."
- [ ] Envío de imágenes
- [ ] Emojis
- [ ] Búsqueda dentro de conversaciones
- [ ] Persistencia de estado de leído/no leído
- [ ] Archivar conversaciones
- [ ] Bloquear usuarios
- [ ] Notificaciones push
- [ ] Grupos de chat

## 🐛 Troubleshooting

### No veo el botón de chat

- Verifica que estés logueado
- El chat solo es visible para usuarios autenticados
- Revisa la consola para ver si Socket.IO se conectó correctamente

### No aparecen conversaciones

- Ejecuta el seed de chats: `node seeds/chats.js`
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la consola del navegador para errores
- Asegúrate de que Socket.IO esté conectado (verás ✅ en consola del servidor)

### Los mensajes no se envían

- Verifica la conexión con el backend
- Asegúrate de tener un token válido
- Revisa los logs del servidor
- Verifica que Socket.IO esté conectado (check en DevTools → Network → WS)

### Socket.IO no se conecta

- Verifica que el backend esté corriendo
- Asegúrate de tener un token válido en las cookies
- Revisa el CORS en el backend (debe permitir localhost:5173)
- Mira en DevTools → Network → WS para ver el handshake

## 🎯 Uso en producción

Para usar el chat con Socket.IO en producción:

1. **Configurar variables de entorno:**

   - Backend: `VITE_API_URL` en frontend
   - Frontend: URL del servidor Socket.IO

2. **Escalabilidad con Redis:**

   - Implementar Redis Adapter para múltiples instancias
   - Permite balanceo de carga

   ```javascript
   const { createAdapter } = require("@socket.io/redis-adapter");
   const { createClient } = require("redis");

   const pubClient = createClient({ url: "redis://localhost:6379" });
   const subClient = pubClient.duplicate();

   io.adapter(createAdapter(pubClient, subClient));
   ```

3. **Seguridad:**

   - Usar HTTPS/WSS en producción
   - Validar todos los eventos del lado del servidor
   - Implementar rate limiting
   - Sanitizar mensajes para prevenir XSS

4. **Performance:**

   - Añadir paginación a la carga de mensajes
   - Implementar caché con Redis
   - Añadir índices en MongoDB para queries de chat
   - Comprimir mensajes grandes

5. **Monitoring:**
   - Logs de conexiones/desconexiones
   - Métricas de mensajes enviados
   - Alertas de errores
   - Dashboard de Socket.IO

## 🔧 Desarrollo

### Ejecutar en modo desarrollo:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

### Ver conexiones Socket.IO:

En el backend verás logs como:

```
✅ Usuario conectado: customer1@example.com (64abc...)
Usuario customer1@example.com se unió al chat 64def...
📨 Mensaje enviado en chat 64def... por customer1@example.com
```

En el frontend (DevTools → Console):

```
✅ Socket conectado: abc123xyz
```

### Debugging:

1. **Backend:** Revisa logs en la terminal del servidor
2. **Frontend:** Abre DevTools → Network → WS para ver WebSocket
3. **Socket.IO Admin UI:** Puedes instalar y usar el Admin UI de Socket.IO
