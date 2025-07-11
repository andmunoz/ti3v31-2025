"use client";

// Importamos las bibliotecas para utilizar efectos y estados de objetos
import { useEffect, useState } from "react";

// Importamos el componente reusable ClienteCard
import ClienteCard from "./components/ClienteCard";

// Definimos el componente principal de la página
export default function Home() {
  // Se declaran los 3 objetos que representarán las entidades de dato de la API
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [relaciones, setRelaciones] = useState([]);

  // Se declara objeto que definirá si aparece o no el mensaje "Cargando datos"
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Definición de la función asíncrona para obtener los datos de la API
    async function fetchData() {
      try {
        // Definimos los objetos y llamamos a los servicios de la API
        const [clientesRes, ventasRes, relacionesRes] = await Promise.all([
          fetch("https://apiclases.inacode.cl/apiIOTBE/clientes"),
          fetch("https://apiclases.inacode.cl/apiIOTBE/ventas"),
          fetch("https://apiclases.inacode.cl/apiIOTBE/asociaciones/clientes-venta"),
        ]);

        // Definimos las variables que estarán esperando los datos de respuesta de 
        // los servicios de la API
        const [clientesData, ventasData, relacionesData] = await Promise.all([
          clientesRes.json(),
          ventasRes.json(),
          relacionesRes.json(),
        ]);

        // Almacenamiento de los datos ya obtenidos en los objetos que representan
        // las entidades de datos de la API.
        setClientes(clientesData);
        setVentas(ventasData);
        setRelaciones(relacionesData);
      } catch (error) {
        // En caso de error, no se detiene el programa
        console.error("Error al cargar datos:", error);
      } finally {
        // Si todo sale bien, se deja de mostrar el mensaje "Cargando datos"
        setCargando(false);
      }
    }

    // Se invoca a la función que obtiene y almacena los datos de la API
    fetchData();
  }, []);

  // Definir una estructura que relaciona los datos de Ventas por Cliente 
  const obtenerVentasPorCliente = (clienteId) => {
    // Se realiza la consulta de las ventas del cliente identificado clienteId
    const ventasCliente = relaciones
      .filter(rel => rel.clientes_id_cliente === clienteId)
      .map(rel => ventas.find(v => v.id_venta === rel.venta_id_venta))
      .filter(Boolean);

    // Se calcula el total de todas las ventas del cliente
    const total = ventasCliente.reduce((sum, venta) => {
      const monto = parseFloat(venta.totalVenta || 0);
      return sum + (isNaN(monto) ? 0 : monto);
    }, 0);

    // Devuelve la información de las ventas del cliente y el total sumado
    return { ventas: ventasCliente, total };
  };

  // Esto es lo que se dibuja en la pagína (es el "children")
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {cargando ? (
        <p className="text-center text-gray-500">Cargando datos...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clientes.map(cliente => {
            const { ventas, total } = obtenerVentasPorCliente(cliente.id_cliente);
            return (
              // Aquí se hace referencia a la componente ClienteCard
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
