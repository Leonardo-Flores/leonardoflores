import "styles/globals.css";
import { ThemeProvider } from "context/ThemeContext";

function myApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default myApp;
