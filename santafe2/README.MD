# Mini CRUD de Tareas - Flask + SQL Server

Aplicación web básica para gestión de tareas (Crear, Leer, Actualizar, Eliminar).

## 🛠️ Requisitos
- Python 3.x
- SQL Server (SSMS)
- Librerías de Python: `pip install flask pyodbc`

## ⚙️ Configuración de Base de Datos
Ejecutar el siguiente script en SQL Server Management Studio (SSMS):

    CREATE DATABASE TEST101;
    GO
    USE TEST101;
    GO
    CREATE TABLE diego (
        id INT IDENTITY(1,1) PRIMARY KEY,
        titulo NVARCHAR(255) NOT NULL,
        descripcion NVARCHAR(MAX),
        estado NVARCHAR(50) DEFAULT 'pendiente',
        fecha_creacion DATETIME DEFAULT GETDATE()
    );

## 🔌 Configuración del Código
En `app.py`, verificar la cadena de conexión:
- Servidor: `SERVER=localhost\\SQLEXPRESS;`
- Certificado: `TrustServerCertificate=yes;` (necesario para conexiones locales)

## 🚀 Ejecución
1. Abrir la terminal en la carpeta del proyecto.
2. Ejecutar el servidor:
   `python app.py`
3. Abrir en el navegador: **http://localhost:5000**

## 📡 Endpoints de la API
- `GET /tasks` - Listar todas las tareas
- `POST /tasks` - Crear una nueva tarea
- `PUT /tasks/<id>` - Actualizar una tarea
- `DELETE /tasks/<id>` - Eliminar una tarea

## 👤 Autor
Diego