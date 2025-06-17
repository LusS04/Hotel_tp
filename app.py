from flask import Flask, request, jsonify
from base_datos.conexion import Conexion
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/registrar', methods=['POST'])
def registrar_usuario():
    datos = request.get_json()

    nombre = datos.get('nombre')
    email = datos.get('email')
    telefono = datos.get('telefono')
    direccion = datos.get('direccion')
    tipo_tarjeta = datos.get('tipoTarjeta')
    numero_tarjeta = datos.get('numeroTarjeta')
    fecha_vencimiento = datos.get('fechaVencimiento')
    contrasenna = datos.get('password')

    conexion = Conexion("base_datos/base_datos.db")
    conexion.crear_tabla_cliente()

    if conexion.existe_email(email):
        conexion.cerrar_conexion()
        return jsonify({'error': 'El email ya está registrado'}), 409

    conexion.agregar_cliente(
        nombre, email, telefono, direccion,
        tipo_tarjeta, numero_tarjeta, fecha_vencimiento, contrasenna
    )
    conexion.cerrar_conexion()

    return jsonify({'mensaje': 'Usuario registrado correctamente'}), 200

@app.route('/api/login', methods=['POST'])
def login_usuario():
    datos = request.get_json()
    email = datos.get('email')
    password = datos.get('password')

    conexion = Conexion("base_datos/base_datos.db")
    acceso = conexion.verificar_credenciales(email, password)
    conexion.cerrar_conexion()

    if acceso:
        return jsonify({'token': 'token-ficticio'}), 200
    else:
        return "Usuario o contraseña incorrecta", 401

@app.route('/api/usuario', methods=['GET'])
def obtener_datos_usuario():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email no proporcionado'}), 400

    conexion = Conexion("base_datos/base_datos.db")
    conexion.cursor.execute("""
        SELECT nombre, email, telefono, direccion, tipo_tarjeta, numero_tarjeta, fecha_vencimiento
        FROM clientes WHERE email = ?
    """, (email,))
    fila = conexion.cursor.fetchone()
    conexion.cerrar_conexion()

    if fila:
        campos = ['nombre', 'email', 'telefono', 'direccion', 'tipo_tarjeta', 'numero_tarjeta', 'fecha_vencimiento']
        usuario = dict(zip(campos, fila))
        return jsonify(usuario), 200
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404


@app.route('/api/reservas', methods=['POST'])
def crear_reserva():
    datos = request.get_json()

    email_cliente = datos.get('email')
    tipo_habitacion = datos.get('tipoHabitacion')
    check_in = datos.get('checkIn')
    check_out = datos.get('checkOut')

    almuerzo_incluido = datos.get('almuerzoIncluido', False)
    cena_incluida = datos.get('cenaIncluida', False)
    cama_extra = datos.get('camaExtra', False)
    traslado_aeropuerto = datos.get('trasladoAeropuerto', False)

    conexion = Conexion("base_datos/base_datos.db")
    conexion.crear_tabla_reserva()

    if not conexion.existe_email(email_cliente):
        conexion.cerrar_conexion()
        return jsonify({'error': 'El cliente no está registrado'}), 404

    conexion.agregar_reserva(
        email_cliente, tipo_habitacion, check_in, check_out,
        almuerzo_incluido, cena_incluida, cama_extra, traslado_aeropuerto
    )
    conexion.cerrar_conexion()

    return jsonify({'mensaje': 'Reserva creada correctamente'}), 200

@app.route('/api/reservas', methods=['GET'])
def obtener_reservas_usuario():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Falta el parámetro email'}), 400

    conexion = Conexion("base_datos/base_datos.db")
    reservas = conexion.mostrar_reservas_por_email(email)
    conexion.cerrar_conexion()

    return jsonify(reservas), 200

@app.route('/api/reservas/<int:id>', methods=['DELETE'])
def eliminar_reserva(id):
    conexion = Conexion("base_datos/base_datos.db")
    conexion.eliminar_reserva(id)
    conexion.cerrar_conexion()
    return jsonify({'mensaje': 'Reserva eliminada correctamente'}), 200

if __name__ == '__main__':
    app.run(debug=True)
