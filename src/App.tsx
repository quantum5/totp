import {useState} from 'react';
import Input from './Input.tsx';

function App() {
  const [secret, setSecret] = useState('');

  return (
    <div className="totp-app">
      <div className="totp-settings">
        <Input label="Secret key" value={secret} onChange={setSecret} />
      </div>
      <div className="totp-output">

      </div>
    </div>
  );
}

export default App;
