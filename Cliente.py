class Cliente:
    def __init__(self, id_cliente, nombre_completo, dni, email, telefono, direccion=None):
        self.id_cliente = id_cliente
        self.nombre_completo = nombre_completo
        self.dni = dni
        self.email = email
        self.telefono = telefono
        self.direccion = direccion