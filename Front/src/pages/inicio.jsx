import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <Container className="py-2 text-center">
      <div className="banner-fondo mb-4">
        <h1 className="mb-3">Bienvenido a House Hunter</h1>
        <p className="lead px-3">
          Tu próxima estadía comienza aquí. Explorá nuestras habitaciones y reservá en segundos.
        </p>
      </div>

      <h3 className="mb-4">Seleccioná tu habitación</h3>

      <Row className="justify-content-center mb-5">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/img/habitacion_premium.png" />
            <Card.Body>
              <Card.Title>Habitación Premium</Card.Title>
              <Card.Text>
                Comodidad y elegancia para una experiencia inolvidable.
              </Card.Text>
              <Button as={Link} to="/reserva" variant="primary">
                Ver más
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/img/habitacion_familiar.png" />
            <Card.Body>
              <Card.Title>Habitación Familiar</Card.Title>
              <Card.Text>
                Espacio ideal para familias con todas las comodidades.
              </Card.Text>
              <Button as={Link} to="/reserva" variant="primary">
                Ver más
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/img/habitacion_matrimonial.png" />
            <Card.Body>
              <Card.Title>Habitación Matrimonial</Card.Title>
              <Card.Text>
                Ideal para viajes de negocios con servicios premium.
              </Card.Text>
              <Button as={Link} to="/reserva" variant="primary">
                Ver más
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src="/img/habitacion_individual.png" />
            <Card.Body>
              <Card.Title>Habitación Individual</Card.Title>
              <Card.Text>
                Un ambiente íntimo para ocasiones especiales.
              </Card.Text>
              <Button as={Link} to="/reserva" variant="primary">
                Ver más
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
