import sqlite3
from datetime import datetime, timedelta

class Conexion:
    def __init__(self, nombre_bd):
        self.conexion = sqlite3.connect(nombre_bd, check_same_thread=False)
        self.cursor = self.conexion.cursor()
        self.crear_tabla_empleados_limpieza()
        self.crear_tabla_tareas_limpieza()
        self.insertar_empleados_limpieza()

    # ---------- Tablas de Limpieza ----------
    def crear_tabla_empleados_limpieza(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS empleados_limpieza (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                telefono TEXT NOT NULL
            )
        ''')
        self.conexion.commit()

    def crear_tabla_tareas_limpieza(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS tareas_limpieza (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT NOT NULL,
                id_reserva INTEGER NOT NULL,
                id_empleado INTEGER NOT NULL,
                FOREIGN KEY (id_empleado) REFERENCES empleados_limpieza(id),
                FOREIGN KEY (id_reserva) REFERENCES reservas(id)
            )
        ''')
        self.conexion.commit()

    def insertar_empleados_limpieza(self):
        self.cursor.execute("SELECT COUNT(*) FROM empleados_limpieza")
        if self.cursor.fetchone()[0] == 0:
            empleados = [
                ("Carlos Gómez", "123456789"),
                ("Lucía Ramírez", "987654321"),
                ("Pedro Fernández", "456789123")
            ]
            self.cursor.executemany(
                "INSERT INTO empleados_limpieza (nombre, telefono) VALUES (?, ?)", empleados
            )
            self.conexion.commit()

    def obtener_empleado_menos_cargado(self):
        self.cursor.execute('''
            SELECT e.id, COUNT(t.id) AS cantidad_tareas
            FROM empleados_limpieza e
            LEFT JOIN tareas_limpieza t ON e.id = t.id_empleado
            GROUP BY e.id
            ORDER BY cantidad_tareas ASC
            LIMIT 1
        ''')
        resultado = self.cursor.fetchone()
        return resultado[0] if resultado else None

    def asignar_tarea_limpieza(self, fecha, id_reserva):
        id_empleado = self.obtener_empleado_menos_cargado()
        if id_empleado:
            self.cursor.execute(
                '''
                INSERT INTO tareas_limpieza (fecha, id_reserva, id_empleado)
                VALUES (?, ?, ?)
                ''',
                (fecha, id_reserva, id_empleado)
            )
            self.conexion.commit()

    # ---------- Clientes ----------
    def crear_tabla_cliente(self):
        self.cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                telefono TEXT NOT NULL,
                direccion TEXT NOT NULL,
                tipo_tarjeta TEXT NOT NULL,
                numero_tarjeta TEXT NOT NULL,
                fecha_vencimiento TEXT NOT NULL,
                contrasenna TEXT NOT NULL
            )
            '''
        )
        self.conexion.commit()

    def agregar_cliente(self, nombre, email, telefono, direccion, tipo_tarjeta, numero_tarjeta, fecha_vencimiento, contrasenna):
        self.cursor.execute(
            '''
            INSERT INTO clientes (
                nombre, email, telefono, direccion,
                tipo_tarjeta, numero_tarjeta, fecha_vencimiento, contrasenna
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (nombre, email, telefono, direccion, tipo_tarjeta, numero_tarjeta, fecha_vencimiento, contrasenna)
        )
        self.conexion.commit()

    def editar_cliente(self, email, contrasenna):
        self.cursor.execute(
            '''
            UPDATE clientes
            SET contrasenna = ?
            WHERE email = ?
            ''',
            (contrasenna, email)
        )
        self.conexion.commit()

    def mostrar_clientes(self):
        self.cursor.execute("SELECT * FROM clientes")
        return self.cursor.fetchall()

    def eliminar_cliente(self, email):
        self.cursor.execute("DELETE FROM clientes WHERE email = ?", (email,))
        self.conexion.commit()

    def existe_email(self, email):
        self.cursor.execute("SELECT * FROM clientes WHERE email = ?", (email,))
        return self.cursor.fetchone() is not None

    def verificar_credenciales(self, email, contrasenna):
        self.cursor.execute(
            "SELECT * FROM clientes WHERE email = ? AND contrasenna = ?",
            (email, contrasenna)
        )
        return self.cursor.fetchone() is not None

    # ---------- Reservas ----------
    def crear_tabla_reserva(self):
        self.cursor.execute(
            '''
            CREATE TABLE IF NOT EXISTS reservas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email_cliente TEXT NOT NULL,
                tipo_habitacion TEXT NOT NULL,
                check_in TEXT NOT NULL,
                check_out TEXT NOT NULL,
                almuerzo_incluido BOOLEAN NOT NULL DEFAULT 0,
                cena_incluida BOOLEAN NOT NULL DEFAULT 0,
                cama_extra BOOLEAN NOT NULL DEFAULT 0,
                traslado_aeropuerto BOOLEAN NOT NULL DEFAULT 0,
                FOREIGN KEY (email_cliente) REFERENCES clientes(email)
            )
            '''
        )
        self.conexion.commit()

    def agregar_reserva(self, email_cliente, tipo_habitacion, check_in, check_out, almuerzo_incluido, cena_incluida, cama_extra, traslado_aeropuerto):
        self.cursor.execute(
            '''
            INSERT INTO reservas (
                email_cliente, tipo_habitacion, check_in, check_out,
                almuerzo_incluido, cena_incluida, cama_extra, traslado_aeropuerto
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                email_cliente, tipo_habitacion, check_in, check_out,
                int(almuerzo_incluido), int(cena_incluida), int(cama_extra), int(traslado_aeropuerto)
            )
        )
        self.conexion.commit()

        # Obtener el ID de la reserva recién insertada
        reserva_id = self.cursor.lastrowid

        # Calcular fechas para limpieza
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")

        dia_antes = (check_in_date - timedelta(days=1)).strftime("%Y-%m-%d")
        dia_despues = (check_out_date + timedelta(days=1)).strftime("%Y-%m-%d")

        self.asignar_tarea_limpieza(dia_antes, reserva_id)
        self.asignar_tarea_limpieza(dia_despues, reserva_id)

    def mostrar_reservas(self):
        self.cursor.execute("SELECT * FROM reservas")
        return self.cursor.fetchall()

    def mostrar_reservas_por_email(self, email_cliente):
        self.cursor.execute("SELECT * FROM reservas WHERE email_cliente = ?", (email_cliente,))
        return self.cursor.fetchall()

    def eliminar_reserva(self, reserva_id):
        self.cursor.execute("DELETE FROM reservas WHERE id = ?", (reserva_id,))
        self.conexion.commit()

    # ---------- General ----------
    def cerrar_conexion(self):
        self.cursor.close()
        self.conexion.close()
