import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ApplicationProvider } from './contexts/ApplicationContext.tsx';

createRoot(document.getElementById("root")!).render(
  <ApplicationProvider>
    <App />
  </ApplicationProvider>
);
