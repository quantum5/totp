import {ALGORITHMS, HashAlgorithm} from './algorithms.tsx';

export type State = {
  secret: string;
  step: number;
  digits: number;
  algorithm: HashAlgorithm;
};

export const defaults: State = {
  secret: '',
  step: 30,
  digits: 6,
  algorithm: 'sha1',
} as const;

export function serializeState(state: State): string {
  const values = (['secret', 'step', 'digits', 'algorithm'] as Array<keyof State>).map(
    (key) => state[key] !== defaults[key] ? encodeURIComponent(state[key]) : '',
  );
  while (values[values.length - 1] === '') {
    values.pop();
  }
  return values.join('/');
}

export function deserializeState(data: string): State {
  const values = data.split('/').map(decodeURIComponent);
  return {
    secret: values[0] || defaults.secret,
    step: +values[1] || defaults.step,
    digits: +values[2] || defaults.digits,
    algorithm: values[3] in ALGORITHMS !== undefined ? values[3] as HashAlgorithm : defaults.algorithm,
  };
}
