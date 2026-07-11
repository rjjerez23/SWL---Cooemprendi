import "./Pagos.css";

function Pagos() {
  const pagos = [
    { id: 1, socio: "Juan Pérez", monto: "RD$ 2,000", fecha: "01/07/2026", metodo: "Transferencia", estado: "Completado" },
    { id: 2, socio: "María López", monto: "RD$ 3,500", fecha: "02/07/2026", metodo: "Efectivo", estado: "Pendiente" },
    { id: 3, socio: "Carlos Rodríguez", monto: "RD$ 1,500", fecha: "03/07/2026", metodo: "Tarjeta", estado: "Completado" },
    { id: 4, socio: "Ana Martínez", monto: "RD$ 5,000", fecha: "04/07/2026", metodo: "Transferencia", estado: "Completado" },
    { id: 5, socio: "Pedro Gómez", monto: "RD$ 2,500", fecha: "05/07/2026", metodo: "Efectivo", estado: "Completado" },
    { id: 6, socio: "Laura Fernández", monto: "RD$ 4,000", fecha: "06/07/2026", metodo: "Transferencia", estado: "Pendiente" },
    { id: 7, socio: "José Ramírez", monto: "RD$ 3,000", fecha: "07/07/2026", metodo: "Tarjeta", estado: "Completado" },
    { id: 8, socio: "Sofía Castillo", monto: "RD$ 6,000", fecha: "08/07/2026", metodo: "Transferencia", estado: "Completado" },
  ];

  return (
    <section className="pagos-card">
      <div className="pagos-header">
        <div>
          <p className="pagos-subtitle">COOEMPRENDII</p>
          <h1>Gestión de Pagos</h1>
        </div>

        <button className="btn-nuevo-pago">+ Nuevo pago</button>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-pagos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Socio</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id}>
                <td>{pago.id}</td>
                <td>{pago.socio}</td>
                <td>{pago.monto}</td>
                <td>{pago.fecha}</td>
                <td>{pago.metodo}</td>
                <td>
                  <span className={`estado-pago ${pago.estado.toLowerCase()}`}>
                    {pago.estado}
                  </span>
                </td>
                <td className="acciones-pago">
                  <button className="btn-editar-pago">Editar</button>
                  <button className="btn-eliminar-pago">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Pagos;