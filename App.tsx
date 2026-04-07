import { AuthProvider } from './src/context/AuthProvider';
import Routes from './src/Routes';

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
