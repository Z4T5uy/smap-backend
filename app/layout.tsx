export const metadata = {
  title: "SMap",
  description: "Загрузка картинок для мода",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
