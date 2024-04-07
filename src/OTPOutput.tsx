import React from 'react';
import {HashAlgorithms, HOTP, HOTPOptions} from '@otplib/core';
import {createDigest} from '@otplib/plugin-crypto-js';
import classNames from 'classnames';

const ALGORITHMS = {
  sha1: HashAlgorithms.SHA1,
  sha256: HashAlgorithms.SHA256,
  sha512: HashAlgorithms.SHA512,
};

export type HashAlgorithm = keyof typeof ALGORITHMS;

function OTPCode({code, delta}: { code: string; delta: number }) {
  return <div className={classNames('totp-code', {
    'totp-older': delta < 0,
    'totp-newer': delta > 0,
    'totp-current': delta === 0,
    'totp-far': Math.abs(delta) > 5,
  })}>
    {code}
  </div>;
}

export default function OTPOutput({secret, offset, algorithm, digits}: {
  secret: string;
  offset: number;
  algorithm: HashAlgorithm;
  digits: number;
}) {
  const otp = React.useMemo(() => new HOTP<HOTPOptions>({
    createDigest,
    digits,
    algorithm: ALGORITHMS[algorithm],
  }), [digits, algorithm]);

  return <div className="totp-output">
    {[...Array(21).keys()].map((i) => {
      const delta = i - 10;
      const current = offset + delta;
      return <OTPCode key={current} code={otp.generate(secret, current)} delta={delta}/>;
    })}
  </div>;
}
