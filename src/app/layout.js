import "./globals.css";


export const metadata = {
  title: "itskishankumar ChatApp",
  description: "Interview assignment for levels.fyi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
