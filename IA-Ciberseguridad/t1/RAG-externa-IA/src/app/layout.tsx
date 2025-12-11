import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RAG Chatbot - IA Ciberseguridad',
  description: 'Sistema de Retrieval-Augmented Generation para consultas sobre IA y Ciberseguridad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        height: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}
