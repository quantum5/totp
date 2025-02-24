import {useMemo} from 'react';
import {HOTP, HOTPOptions} from '@otplib/core';
import {createDigest} from '@otplib/plugin-crypto-js';
import classNames from 'classnames';
import CopyButton from './CopyButton.tsx';
import {ALGORITHMS, HashAlgorithm} from './algorithms.tsx';

function OTPCode({code, delta}: { code: string; delta: number }) {
  return <div className={classNames('totp-code', {
    'totp-older': delta < 0,
    'totp-newer': delta > 0,
    'totp-current': delta === 0,
    'totp-far': Math.abs(delta) > 5,
    'totp-near-first': delta === -5,
    'totp-near-last': delta === 5,
  })}>
    {code}
    <CopyButton text={code}/>
  </div>;
}

export default function OTPOutput({secret, offset, algorithm, digits}: {
  secret: ArrayBuffer;
  offset: number;
  algorithm: HashAlgorithm;
  digits: number;
}) {
  const otp = useMemo(() => new HOTP<HOTPOptions>({
    createDigest,
    digits,
    algorithm: ALGORITHMS[algorithm],
  }), [digits, algorithm]);

  return <div className="totp-output">
    {[...Array(21).keys()].map((i) => {
      const delta = i - 10;
      const current = offset + delta;
      return <OTPCode key={current} code={otp.generate(
        // they really wanted an ArrayBuffer or some similar binary type
        // but misdeclared the type
        secret as unknown as string,
        current,
      )} delta={delta}/>;
    })}
  </div>;
}
