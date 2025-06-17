import { Container, Row, Col } from 'react-bootstrap'

export default function Nosotros() {
  return (
    <Container className="py-4">
      <h1 className="text-center mb-4">Sobre Nosotros</h1>

      <Row className="mb-5">
        <Col md={6}>
          <img
            src="/img/hotel.png"
            alt="Hotel"
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <p>
            Bienvenido a <strong>House Hunter</strong>, un espacio diseñado para que tu estadía sea cómoda, segura y memorable.
            Nuestro compromiso es ofrecer un servicio personalizado que se adapte a las necesidades de cada huésped, asegurando
            una experiencia única desde el momento de la reserva hasta el check-out.
          </p>
          <p>
            Contamos con una amplia variedad de habitaciones, desde suites familiares hasta habitaciones individuales, todas equipadas
            con las comodidades modernas para que te sientas como en casa. Nuestra ubicación estratégica te permite acceder fácilmente
            a los principales puntos turísticos y de negocios de la ciudad.
          </p>
          <p>
            En House Hunter, valoramos la hospitalidad, la atención al detalle y la satisfacción del cliente. Nuestro equipo está siempre
            disponible para ayudarte a planificar tu estadía, ofrecer recomendaciones locales y asegurarse de que todo esté a tu gusto.
          </p>
          <p>
            Además, nos preocupamos por el medio ambiente y la comunidad, implementando prácticas sostenibles y apoyando iniciativas locales
            que contribuyen al desarrollo de nuestra región.
          </p>
          <p>
            Gracias por elegirnos. Esperamos darte la bienvenida muy pronto y ser parte de tus mejores recuerdos de viaje.
          </p>
        </Col>
      </Row>
    </Container>
  )
}
