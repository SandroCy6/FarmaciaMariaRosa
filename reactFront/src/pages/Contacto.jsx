import React, { useState } from 'react';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    dni: '',
    telefono: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      let mensajeUI = '';
      let status = '';

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        mensajeUI = data.message || 'Mensaje enviado';
        status = data.status || '';
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          mensajeUI = data.message || 'Mensaje enviado';
          status = data.status || '';
        } catch {
          mensajeUI = text || 'Mensaje enviado';
        }
      }

      if (status === 'success' || response.ok) {
        setFormSuccess(mensajeUI);
        setFormData({ nombre: '', email: '', dni: '', telefono: '', mensaje: '' });
      } else {
        setFormError(mensajeUI);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setFormError('Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CONTENIDO PRINCIPAL */}
      <main className="contact-page">
        <div className="container">
          {/* Encabezado */}
          <div className="contact-header animate-fade-in">
            <h1 className="titulo-gradiente">¡Contáctanos!</h1>
            <p>
              Estamos aquí para ayudarte. Ponte en contacto con nosotros a través
              de cualquiera de nuestros canales disponibles.
            </p>
          </div>

          <div className="row contact-cards-container">
            {/* Información de contacto - Ubicación */}
            <div
              className="col-lg-4 col-md-6 mb-4 animate-fade-in d-flex"
              style={{ '--animation-delay': '0.2s' }}
            >
              <div className="contact-card w-100">
                <div className="contact-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div className="contact-info">
                  <h3>Ubicación</h3>
                  <p>Av. Huacachina Frente Hospital Regional</p>
                  <p>Ciudad ICA, Perú</p>
                </div>
              </div>
            </div>

            {/* Información de contacto - Teléfono */}
            <div
              className="col-lg-4 col-md-6 mb-4 animate-fade-in d-flex"
              style={{ '--animation-delay': '0.4s' }}
            >
              <div className="contact-card w-100">
                <div className="contact-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div className="contact-info">
                  <h3>Teléfono</h3>
                  <p>
                    <a href="tel:+51922684873">+51 922 684 873</a>
                  </p>
                  <p>Lunes a Domingo: 8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>

            {/* Información de contacto - Email */}
            <div
              className="col-lg-4 col-md-12 mb-4 animate-fade-in d-flex"
              style={{ '--animation-delay': '0.6s' }}
            >
              <div className="contact-card w-100">
                <div className="contact-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div className="contact-info">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:info@farmaciamariarosa.cl">
                      info@farmaciamariarosa.cl
                    </a>
                  </p>
                  <p>Respondemos en menos de 24 horas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {/* Formulario de contacto */}
            <div
              className="col-lg-6 mb-5 animate-fade-in"
              style={{ '--animation-delay': '0.8s' }}
            >
              <div className="contact-form-container">
                <h2 className="mb-4">Envíanos un mensaje</h2>
                <form id="contactForm" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      placeholder="Ingresa tu nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Ingresa tu email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dni" className="form-label">
                      DNI
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="dni"
                      placeholder="Ingresa tu DNI"
                      value={formData.dni}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      placeholder="Ingresa tu teléfono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label">
                      Mensaje
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      rows="5"
                      placeholder="Escribe tu mensaje aquí..."
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    ></textarea>
                  </div>

                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div className="alert alert-success" role="alert">
                      {formSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              </div>
            </div>

            {/* Mapa y horario */}
            <div className="col-lg-6">
              <div className="row">
                {/* Mapa */}
                <div
                  className="col-12 mb-4 animate-fade-in"
                  style={{ '--animation-delay': '1s' }}
                >
                  <h3 className="mb-3">Encuéntranos aquí</h3>
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.235476632399!2d-75.7283519250181!3d-14.068258987271255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e2bdae3019ad%3A0xdc6e2b5e5181f6fd!2sHospital%20Regional%20de%20Ica!5e0!3m2!1ses!2spe!4v1701799551233!5m2!1ses!2spe"
                      allowFullScreen=""
                      loading="lazy"
                      title="Ubicación de Farmacia María Rosa"
                    ></iframe>
                  </div>
                </div>

                {/* Horario de atención */}
                <div
                  className="col-12 animate-fade-in"
                  style={{ '--animation-delay': '1.2s' }}
                >
                  <div className="contact-card">
                    <h3 className="mb-4">Horario de atención</h3>
                    <table className="schedule-table">
                      <tbody>
                        <tr>
                          <td>Lunes a Viernes</td>
                          <td>8:00 AM - 10:00 PM</td>
                        </tr>
                        <tr>
                          <td>Sábados</td>
                          <td>9:00 AM - 9:00 PM</td>
                        </tr>
                        <tr>
                          <td>Domingos y Feriados</td>
                          <td>9:00 AM - 2:00 PM</td>
                        </tr>
                        <tr>
                          <td>Servicio de entrega</td>
                          <td>24/7 para emergencias</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loader Overlay */}
        {loading && (
          <div id="loading-overlay" style={{ display: 'flex' }}>
            <div className="spinner"></div>
            <p
              style={{
                marginTop: '15px',
                color: '#b50011',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Enviando tu mensaje...
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default Contacto;
