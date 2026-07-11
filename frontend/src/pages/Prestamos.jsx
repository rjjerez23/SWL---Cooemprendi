import "./Prestamos.css";

function Prestamos() {
  const prestamos = [
    {
      id: 1,
      socio: "Juan Pérez",
      monto: "RD$ 10,000",
      interes: "12%",
      cuotas: 12,
      fecha: "01/07/2026",
      estado: "Aprobado",
    },
    {
      id: 2,
      socio: "María López",
      monto: "RD$ 25,000",
      interes: "15%",
      cuotas: 24,
      fecha: "02/07/2026",
      estado: "Pendiente",
    },
    {
      id: 3,
      socio: "Carlos Rodríguez",
      monto: "RD$ 18,000",
      interes: "13%",
      cuotas: 18,
      fecha: "03/07/2026",
      estado: "Aprobado",
    },
    {
      id: 4,
      socio: "Ana Martínez",
      monto: "RD$ 40,000",
      interes: "16%",
      cuotas: 36,
      fecha: "04/07/2026",
      estado: "Pendiente",
    },
    {
      id: 5,
      socio: "Pedro Gómez",
      monto: "RD$ 15,000",
      interes: "12%",
      cuotas: 12,
      fecha: "05/07/2026",
      estado: "Aprobado",
    },
    {
      id: 6,
      socio: "Laura Fernández",
      monto: "RD$ 30,000",
      interes: "14%",
      cuotas: 24,
      fecha: "06/07/2026",
      estado: "Aprobado",
    },
    {
      id: 7,
      socio: "José Ramírez",
      monto: "RD$ 22,000",
      interes: "13%",
      cuotas: 18,
      fecha: "07/07/2026",
      estado: "Pendiente",
    },
    {
      id: 8,
      socio: "Sofía Castillo",
      monto: "RD$ 50,000",
      interes: "17%",
      cuotas: 36,
      fecha: "08/07/2026",
      estado: "Aprobado",
    },
  ];

  return (
    <main className="prestamos-page">
      <section className="prestamos-card">
        <div className="prestamos-header">
          <div>
            <p className="prestamos-subtitle">COOEMPRENDII</p>
            <h1>Gestión de Préstamos</h1>
          </div>

          <button className="btn-nuevo">+ Nuevo préstamo</button>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-prestamos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Socio</th>
                <th>Monto</th>
                <th>Interés</th>
                <th>Cuotas</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {prestamos.map((prestamo) => (
                <tr key={prestamo.id}>
                  <td>{prestamo.id}</td>
                  <td>{prestamo.socio}</td>
                  <td>{prestamo.monto}</td>
                  <td>{prestamo.interes}</td>
                  <td>{prestamo.cuotas}</td>
                  <td>{prestamo.fecha}</td>
                  <td>{prestamo.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Prestamos;