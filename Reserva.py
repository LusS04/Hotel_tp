class Reserva:
    def __init__(self, id_reserva, id_cliente, numero_habitacion, check_in, check_out, estado):
        self.id_reserva = id_reserva
        self.id_cliente = id_cliente
        self.numero_habitacion = numero_habitacion
        self.check_in = check_in
        self.check_out = check_out
        self.estado = estado