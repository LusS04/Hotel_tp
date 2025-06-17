import { Container, Row, Col, Card, Button, Image, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Usuario() {
  const { isAuthenticated, logout, userEmail } = useAuth(); 
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      axios.get(`http://localhost:5000/api/usuario?email=${encodeURIComponent(userEmail)}`)
        .then(res => {
          setUsuario(res.data);
          return axios.get(`http://localhost:5000/api/reservas?email=${encodeURIComponent(userEmail)}`);
        })
        .then(reservaRes => {
          // Mapear cada array a un objeto con propiedades legibles
          const reservasMapeadas = reservaRes.data.map(r => ({
            id: r[0],
            email: r[1],
            tipo_habitacion: r[2],
            check_in: r[3],
            check_out: r[4],
            // Puedes agregar más campos si los necesitas, con r[5], r[6], etc.
          }));
          setReservas(reservasMapeadas);
        })
        .catch(err => {
          console.error('Error al obtener datos o reservas:', err);
        });
    }
  }, [isAuthenticated, userEmail]);

  const cancelarReserva = async (idReserva) => {
    if (!window.confirm('¿Seguro querés cancelar esta reserva?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/reservas/${idReserva}`);
      setReservas(reservas.filter(r => r.id !== idReserva));
      alert('Reserva cancelada con éxito.');
    } catch (error) {
      alert('No se pudo cancelar la reserva.');
      console.error(error);
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
      <Row className="mb-4">
        {/* Sección de Perfil */}
        <Col md={4}>
          <Card className="p-3 text-center">
            <Image
              src="/img/profile.jpg"
              roundedCircle
              width={120}
              height={120}
              className="mb-3"
            />
            <Card.Title>{usuario?.nombre || 'Cargando...'}</Card.Title>
          </Card>

          <div className="d-grid gap-2 mt-3">
            <Button variant="outline-danger" onClick={() => {
              logout();
              navigate('/login');
            }}>
              Cerrar sesión
            </Button>
          </div>
        </Col>

        {/* Datos del Usuario */}
        <Col md={8}>
          <Card className="p-3 mb-4">
            <Card.Header>Datos del usuario</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Nombre:</strong> {usuario?.nombre || '...'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {usuario?.email || '...'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Teléfono:</strong> {usuario?.telefono || '...'}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Dirección:</strong> {usuario?.direccion || '...'}
              </ListGroup.Item>
            </ListGroup>
          </Card>

          {/* Tarjeta Ingresada */}
          <Card className="p-3 mb-4">
            <Card.Header>Método de pago</Card.Header>
            <Card.Body className="d-flex align-items-center">
              <Image
                src="/img/visa-logo.png"
                width={60}
                height={40}
                className="me-3"
              />
              <div>
                <div><strong>{usuario?.tipo_tarjeta || '...'}</strong></div>
                <div className="text-muted">**** **** **** {usuario?.numero_tarjeta?.slice(-4) || '****'}</div>
                <div className="text-muted">Vence {usuario?.fecha_vencimiento || '--/--'}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reservas */}
      <Card className="p-3">
        <Card.Header>Mis reservas</Card.Header>
        <ListGroup variant="flush">
          {reservas.length === 0 && (
            <ListGroup.Item>No tienes reservas.</ListGroup.Item>
          )}
          {reservas.map(reserva => (
            <ListGroup.Item key={reserva.id} className="d-flex justify-content-between align-items-center">
              <div>
                <div><strong>{reserva.tipo_habitacion}</strong></div>
                <small className="text-muted">
                  Del {new Date(reserva.check_in).toLocaleDateString()} al {new Date(reserva.check_out).toLocaleDateString()}
                </small>
              </div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => cancelarReserva(reserva.id)}
              >
                Cancelar
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
}
