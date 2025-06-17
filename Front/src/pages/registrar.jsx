import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function Registrar() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    tipoTarjeta: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
    setMensaje(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMensaje(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    const { confirmPassword, ...dataToSend } = formData

    try {
      const res = await fetch('http://localhost:5000/api/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Error en el registro')
      } else {
        setMensaje(result.mensaje || 'Registro exitoso')
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          direccion: '',
          tipoTarjeta: '',
          numeroTarjeta: '',
          fechaVencimiento: '',
          password: '',
          confirmPassword: '',
        })

        // Esperar 1 segundo para mostrar el mensaje, luego redirigir
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    } catch (err) {
      setError('Error al comunicarse con el servidor')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 ventanabg text-center shadow login-card" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="mb-3">Crear cuenta</h2>
        <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
          <Form.Group className="mb-3 w-100" controlId="formNombre">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formEmail">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              placeholder="+54 11 1234-5678"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              placeholder="Av. Siempre Viva 1234, Buenos Aires"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formTipoTarjeta">
            <Form.Label>Tipo de tarjeta de crédito</Form.Label>
            <Form.Select
              name="tipoTarjeta"
              value={formData.tipoTarjeta}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formNumeroTarjeta">
            <Form.Label>Número de tarjeta</Form.Label>
            <Form.Control
              type="text"
              name="numeroTarjeta"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={formData.numeroTarjeta}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formFechaVencimiento">
            <Form.Label>Fecha de vencimiento</Form.Label>
            <Form.Control
              type="month"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 w-100" controlId="formConfirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {mensaje && <div style={{ color: 'green', marginBottom: '1rem' }}>{mensaje}</div>}

          <div className="d-grid gap-2 w-100 mt-2">
            <Button type="submit" disabled={cargando} variant="success">
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
