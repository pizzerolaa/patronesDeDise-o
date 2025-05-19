# Sistema de Gestión de Productos

## Descripción General

Este sistema implementa una aplicación web para gestionar productos, utilizando una arquitectura MVC (Modelo-Vista-Controlador) y aplicando el patrón de diseño Abstract Method. La aplicación permite realizar operaciones CRUD (Crear, Leer, Actualizar y Eliminar) sobre productos almacenados en Firebase.

## Estructura del Proyecto

### Frontend
- **React**: Framework principal para la interfaz de usuario
- **React Router**: Para la navegación entre páginas
- **Firebase**: Almacenamiento y gestión de datos

### Backend
- **Spring Boot**: Framework para el backend
- **API REST**: Endpoints para operaciones CRUD
- **Firebase**: Base de datos NoSQL

## Implementación del Patrón Abstract Method

El patrón Abstract Method se implementa a través de una clase abstracta `TabAbstract` que define una estructura común para las diferentes pestañas de la aplicación.

## Interfaz de Usuario

### Pestaña 1: Productos Iniciales
Esta pestaña permite agregar nuevos productos al sistema mediante un formulario con validación de datos.

### Pestaña 2: Gestión de Productos
Muestra todos los productos existentes en una tabla con opciones para:

- **Consultar**: Ver detalles completos de un producto en una ventana modal
- **Editar**: Modificar la información de un producto existente
- **Eliminar**: Eliminar un producto previa confirmación

## Conclusiones

El sistema implementa correctamente el patrón Abstract Method y las operaciones CRUD completas. La interfaz de usuario es intuitiva y responde dinámicamente a las acciones del usuario, con validaciones adecuadas para garantizar la integridad de los datos.