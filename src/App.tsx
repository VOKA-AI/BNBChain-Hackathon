import { useAccount } from 'wagmi';
import './App.css';
import { Demo } from './components/demo';
import { UploadModel } from './components/uploadModel';
import { ModelList } from './components/listAllModels';
import { Wallet } from './components/wallet';

function App() {
  const {isConnected} = useAccount()
  return (
    <div className="App">
      <header className="App-header">
        <Wallet />
        {isConnected && <UploadModel />}
        {/* {isConnected && <Demo /> } */}
      </header>
      <div>
        {isConnected && <ModelList /> }

      </div>
    </div>
  );
}

export default App;
