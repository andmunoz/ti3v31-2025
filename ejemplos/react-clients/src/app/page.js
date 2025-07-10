"use client";

import { useEffect, useState } from "react";
import ClienteCard from "./components/ClienteCard";

export default function Home() {
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [relaciones, setRelaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, ventasRes, relacionesRes] = await Promise.all([
          fetch("https://apiclases.inacode.cl/apiIOTBE/clientes"),
          fetch("https://apiclases.inacode.cl/apiIOTBE/ventas"),
          fetch("https://apiclases.inacode.cl/apiIOTBE/asociaciones/clientes-venta"),
        ]);

        const [clientesData, ventasData, relacionesData] = await Promise.all([
          clientesRes.json(),
          ventasRes.json(),
          relacionesRes.json(),
        ]);

        setClientes(clientesData);
        setVentas(ventasData);
        setRelaciones(relacionesData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setCargando(false);
      }
    }

    fetchData();
  }, []);

  const obtenerVentasPorCliente = (clienteId) => {
    const ventasCliente = relaciones
      .filter(rel => rel.clientes_id_cliente === clienteId)
      .map(rel => ventas.find(v => v.id_venta === rel.venta_id_venta))
      .filter(Boolean);

    const total = ventasCliente.reduce((sum, venta) => {
      const monto = parseFloat(venta.totalVenta || 0);
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);

    console.log(ventasCliente)

    return { ventas: ventasCliente, total };
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Resumen de Ventas por Cliente</h1>
      {cargando ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map(cliente => {
            const { ventas, total } = obtenerVentasPorCliente(cliente.id_cliente);
            return (
              <ClienteCard
                key={cliente.id_cliente}
                nombre={cliente.nombre}
                apellido={cliente.apellido}
                correo={cliente.correo}
                telefono={cliente.telefono}
                totalVentas={total}
                ventas={ventas}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
