import React from 'react';
import {HashAlgorithms, HOTP, HOTPOptions} from '@otplib/core';
import {createDigest} from '@otplib/plugin-crypto-js';

const ALGORITHMS = {
  sha1: HashAlgorithms.SHA1,
  sha256: HashAlgorithms.SHA256,
  sha512: HashAlgorithms.SHA512,
};

export type HashAlgorithm = keyof typeof ALGORITHMS;

function OTPCode({code}: { code: string }) {
  return <div className="totp-code">
    {code}
  </div>;
}

export default function OTPOutput({secret, offset, algorithm, digits}: {
  secret: string;
  offset: number;
  algorithm: HashAlgorithm;
  digits: number;
}) {
  const hotp = React.useMemo(() => new HOTP<HOTPOptions>({
    createDigest,
    digits,
    algorithm: ALGORITHMS[algorithm],
  }), [digits, algorithm]);

  return <div className="totp-output">
    {[...Array(21).keys()].map((i) => {
      const current = offset + i - 10;
      return <OTPCode key={current} code={hotp.generate(secret, current)}/>;
    })}
  </div>;
}
