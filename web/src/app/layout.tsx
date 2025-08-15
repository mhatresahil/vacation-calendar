import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Vacation Calendar",
  description: "Plan weeks around holidays",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">{children}</div>
        </Providers>
      </body>
    </html>
  );
}