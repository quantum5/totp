import {useCallback, useEffect, useMemo, useState} from 'react';
import base32Decode from 'base32-decode';
import {NumberInput, TextInput} from './Input';
import OTPOutput from './OTPOutput';
import Select from './Select';
import Collapsible from './Collapsible';
import ActionLink from './ActionLink';
import {defaults, serializeState, deserializeState} from './state';
import {HashAlgorithm} from './algorithms.tsx';

function parseState() {
  if (window.location.hash.startsWith('#!')) {
    return deserializeState(window.location.hash.slice(2));
  }
  return null;
}

function App() {
  const [advanced, setAdvanced] = useState(false);

  const [state, setState] = useState(() => parseState() || defaults);
  const {secret, step, digits, algorithm} = state;
  const [offset, setOffset] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const [validSecret, decoded] = useMemo(() => {
    try {
      return [true, base32Decode(secret.toUpperCase(), 'RFC4648')];
    } catch (e) {
      return [false, undefined];
    }
  }, [secret]);

  const validStep = step > 0;
  const validDigits = digits > 0 && digits <= 10;
  const valid = validSecret && validStep && validDigits && !!secret;

  useEffect(() => {
    if (!validStep) return;
    const now = Date.now();
    setOffset(Math.floor(now / (1000 * step)));
  }, [validStep, step]);

  useEffect(() => {
    if (!validStep) return;
    const now = Date.now();
    const nextUpdate = Math.floor(now / 1000) * 1000 + 1000;
    const timer = setTimeout(() => {
      const now = Date.now();
      const offset = Math.floor(now / (1000 * step));
      const nextUpdate = (offset + 1) * step * 1000;
      setRemaining((nextUpdate - now) / 1000);
      setOffset(offset);
    }, nextUpdate - now);
    return () => clearTimeout(timer);
  }, [validStep, step, offset, remaining]);

  const showAdvanced = useCallback(() => {
    setAdvanced(true);
  }, []);

  const hideAdvanced = useCallback(() => {
    setAdvanced(false);
  }, []);

  const setSecret = useCallback(
    (secret: string) => setState((state) => ({...state, secret})),
    [],
  );

  const setStep = useCallback(
    (step: number) => setState((state) => ({...state, step})),
    [],
  );

  const setDigits = useCallback(
    (digits: number) => setState((state) => ({...state, digits})),
    [],
  );

  const setAlgorithm = useCallback(
    (algorithm: HashAlgorithm) => setState((state) => ({...state, algorithm})),
    [],
  );

  const onReset = useCallback(
    () => setState((state) => ({...state, step: 30, digits: 6, algorithm: 'sha1'})),
    [],
  );

  useEffect(() => {
    const value = serializeState(state);
    history.replaceState(null, '', window.location.pathname + window.location.search + (value && `#!${value}`));
  }, [state]);

  const onHashChange = useCallback(() => {
    const state = parseState();
    state && setState(state);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [onHashChange]);

  return (
    <div className="totp-app">
      <div className="totp-settings">
        <TextInput label="Secret key" value={secret} onChange={setSecret}
                   error={!validSecret && 'Secret must be a valid base32-encoded string'}/>
        <progress className="totp-tick" value={validStep ? remaining : 0} max={validStep ? step : 0}/>
        {advanced ?
          <ActionLink onClick={hideAdvanced}>Hide advanced options</ActionLink> :
          <ActionLink onClick={showAdvanced}>Show advanced options</ActionLink>}
        <Collapsible show={advanced}>
          <NumberInput label="Time step" value={step} onChange={setStep} min={1}
                       error={!validStep && 'You must enter an integer time step ≥ 1 second'}/>
          <NumberInput label="Code digits" value={digits} onChange={setDigits} min={1} max={10}
                       error={!validDigits && 'You must enter an integer digit count between 1 and 10'}/>
          <Select label="Algorithm" value={algorithm} onChange={setAlgorithm} options={{
            sha1: 'SHA-1',
            sha256: 'SHA-256',
            sha512: 'SHA-512',
          }}/>
          <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
        </Collapsible>
      </div>
      {valid && decoded && <OTPOutput secret={decoded} offset={offset} algorithm={algorithm} digits={digits}/>}
    </div>
  );
}

export default App;
