import './globals.css';

export const metadata = {
  title: 'Resumen de Ventas',
  description: 'Aplicación demo en Next.js para mostrar ventas por cliente',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
