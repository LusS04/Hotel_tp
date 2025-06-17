import { Container, Form, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Reserva() {
  const { isAuthenticated, userEmail } = useAuth();
  const navigate = useNavigate();

  const [tipoHabitacion, setTipoHabitacion] = useState('Habitación Premium');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const [almuerzoIncluido, setAlmuerzoIncluido] = useState(false);
  const [cenaIncluida, setCenaIncluida] = useState(false);
  const [camaExtra, setCamaExtra] = useState(false);
  const [trasladoAeropuerto, setTrasladoAeropuerto] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reserva = {
      email: userEmail,
      tipoHabitacion,
      checkIn,
      checkOut,
      almuerzoIncluido,
      cenaIncluida,
      camaExtra,
      trasladoAeropuerto
    };

    console.log(reserva);

    try {
      const respuesta = await fetch('http://localhost:5000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reserva)
      });

      if (respuesta.ok) {
        alert("Reserva realizada con éxito");
        navigate('/'); // redirige al inicio
      } else {
        const error = await respuesta.json();
        alert("Error: " + (error?.error || "No se pudo completar la reserva"));
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5 text-center">
        <h3>Aún no iniciaste sesión</h3>
        <p>Por favor, inicia sesión para ver esta página.</p>
        <Button variant="primary" onClick={() => navigate('/login')}>
          Ir a Login
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">Formulario de Reserva</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTipo">
          <Form.Label>Tipo de habitación</Form.Label>
          <Form.Select
            value={tipoHabitacion}
            onChange={(e) => setTipoHabitacion(e.target.value)}
            required
            disabled={loading}
          >
            <option value="Habitación Matrimonial">Habitación Matrimonial</option>
            <option value="Habitación Individual">Habitación Individual</option>
            <option value="Habitación Premium">Habitación Premium</option>
            <option value="Habitación Familiar">Habitación Familiar</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCheckIn">
          <Form.Label>Fecha de Check-in</Form.Label>
          <Form.Control
            type="date"
            required
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formCheckOut">
          <Form.Label>Fecha de Check-out</Form.Label>
          <Form.Control
            type="date"
            required
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formExtras">
          <Form.Label>Servicios adicionales (el desayuno ya está incluido)</Form.Label>
            <Form.Check
              type="checkbox"
              label="Almuerzo incluido $25"
              checked={almuerzoIncluido}
              onChange={() => setAlmuerzoIncluido(!almuerzoIncluido)}
              disabled={loading}
              id="almuerzoIncluido"
            />
            <Form.Check
              type="checkbox"
              label="Cena incluida $30"
              checked={cenaIncluida}
              onChange={() => setCenaIncluida(!cenaIncluida)}
              disabled={loading}
              id="cenaIncluida"
            />
            <Form.Check
              type="checkbox"
              label="Cama extra $20"
              checked={camaExtra}
              onChange={() => setCamaExtra(!camaExtra)}
              disabled={loading}
              id="camaExtra"
            />
            <Form.Check
              type="checkbox"
              label="Traslado aeropuerto $20"
              checked={trasladoAeropuerto}
              onChange={() => setTrasladoAeropuerto(!trasladoAeropuerto)}
              disabled={loading}
              id="trasladoAeropuerto"
            />

        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? 'Procesando...' : 'Realizar reserva'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
