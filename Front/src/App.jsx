import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import Inicio from './pages/inicio'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import Error404 from './pages/error404'
import Menu from './components/Menu'
import Reserva from './pages/reserva'
import Usuario from './pages/usuario'
import Registrar from './pages/registrar'
import Nosotros from './pages/sobreNosoros'

export default function App() {
  return (
    <BrowserRouter >
      <Menu />
      <Container className="mt-4 ">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reserva" element={<Reserva />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/sobrenosotros" element={<Nosotros />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
