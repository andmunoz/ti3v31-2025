// Se define la componente con todos los datos que debe mostrar
export default function ClienteCard(
  { nombre, apellido, correo, telefono, totalVentas, ventas }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800">{nombre} {apellido}</h2>
      <p className="text-sm text-gray-600"><a href="mailto:{correo}">{correo}</a></p>
      <p className="text-sm text-gray-600">{telefono}</p>
      <p className="mt-4 font-medium text-indigo-600">
        Total de ventas: ${totalVentas.toLocaleString()}
      </p>
      {ventas.length > 0 ? (
        <ul className="mt-2 text-sm text-gray-700 list-disc pl-4">
          {ventas.map((venta, idx) => (
            <li key={idx}>Venta #{venta.id_venta}: ${parseFloat(venta.totalVenta).toLocaleString()}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic mt-2">Sin ventas registradas</p>
      )}
    </div>
  );
}
