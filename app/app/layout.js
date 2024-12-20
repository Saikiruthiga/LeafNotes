import { AuthContextProvider } from "./contexts/AuthContext";
import { BookshelfProvider } from "./contexts/BooksReadCountContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // Import the ThemeProvider
import localFont from "next/font/local";
import "./globals.css";
import IconToggle from "./components/IconToggle"; // Import the IconToggle component
import { CssBaseline } from "@mui/material"; // Import CssBaseline for global reset

// Load Lato Font
const lato = localFont({
  src: "./fonts/Lato-Regular.ttf", // Path to your .ttf file
  variable: "--font-lato",
  weight: "400", // Regular weight
});

// Load Playfair Display Font
const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Italic.ttf", // Path to your .ttf file
  variable: "--font-playfair",
  weight: "400", // Regular weight
});

export const metadata = {
  title: "LeafNotes",
  description: "A note-taking app for book lovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfairDisplay.variable}`}>
        <ThemeProvider>
          {" "}
          {/* Wrap the application in ThemeProvider */}
          <AuthContextProvider>
            <BookshelfProvider>
              {/* CssBaseline normalizes styles globally */}
              <CssBaseline />
              {children} {/* All page content goes here */}
            </BookshelfProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
