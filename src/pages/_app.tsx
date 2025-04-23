import Nav from '../components/Nav';
import { DarkModeProvider } from '../context/DarkModeContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <DarkModeProvider>
      <Nav />
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}

export default MyApp;
