import { CVProvider } from './context/CVContext';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';

function App() {
  return (
    <CVProvider>
      {/*  контейнер */}
      <div style={{ display: 'flex', minHeight: '100vh', gap: '20px', padding: '20px' }}>
        
        {/* левая панель */}
        <FormPanel />
        
        {/* правая панель */}
        <PreviewPanel />
        
      </div>
    </CVProvider>
  );
}

export default App;

