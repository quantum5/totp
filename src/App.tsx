import React, {useState} from 'react';
import {NumberInput, TextInput} from './Input';
import OTPOutput, {HashAlgorithm} from './OTPOutput';
import Select from './Select';
import Collapsible from './Collapsible';
import ActionLink from './ActionLink';
import {type State, defaults, serializeState, deserializeState} from './state';

function parseState() {
  if (window.location.hash.startsWith('#!')) {
    return deserializeState(window.location.hash.slice(2));
  }
  return null;
}

function App() {
  const [advanced, setAdvanced] = useState(false);

  const [state, setState] = React.useState(() => parseState() || defaults);
  const {secret, step, digits, algorithm} = state;
  const [offset, setOffset] = React.useState(0);

  const validStep = step > 0;
  const validDigits = digits > 0 && digits <= 10;
  const valid = validStep && validDigits && !!secret;

  React.useEffect(() => {
    if (!validStep) return;
    const now = Date.now();
    setOffset(Math.floor(now / (1000 * step)));
  }, [validStep, step]);

  React.useEffect(() => {
    if (!validStep) return;
    const now = Date.now();
    const nextOffset = Math.floor(now / (1000 * step)) + 1;
    const nextUpdate = nextOffset * step * 1000;
    const timer = setTimeout(() => setOffset(nextOffset), nextUpdate - now);
    return () => clearTimeout(timer);
  }, [validStep, offset, step]);

  const showAdvanced = React.useCallback(() => {
    setAdvanced(true);
  }, []);

  const hideAdvanced = React.useCallback(() => {
    setAdvanced(false);
  }, []);

  const setSecret = React.useCallback(
    (secret: string) => setState((state) => ({...state, secret})),
    [],
  );

  const setStep = React.useCallback(
    (step: number) => setState((state) => ({...state, step})),
    [],
  );

  const setDigits = React.useCallback(
    (digits: number) => setState((state) => ({...state, digits})),
    [],
  );

  const setAlgorithm = React.useCallback(
    (algorithm: string) => setState((state) => ({...state, algorithm})),
    [],
  );

  const onReset = React.useCallback(
    () => setState((state) => ({...state, step: 30, digits: 6, algorithm: 'sha1'})),
    [],
  );

  React.useEffect(() => {
    const value = serializeState(state);
    console.log(value);
    history.replaceState(null, '', window.location.pathname + window.location.search + (value && `#!${value}`));
  }, [state]);

  const onHashChange = React.useCallback(() => {
    const state = parseState();
    state && setState(state);
  }, []);

  React.useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [onHashChange]);

  return (
    <div className="totp-app">
      <div className="totp-settings">
        <TextInput label="Secret key" value={secret} onChange={setSecret}/>
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
      {valid && <OTPOutput secret={secret} offset={offset} algorithm={algorithm} digits={digits}/>}
    </div>
  );
}

export default App;
