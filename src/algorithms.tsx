import {HashAlgorithms} from '@otplib/core';

export const ALGORITHMS = {
  sha1: HashAlgorithms.SHA1,
  sha256: HashAlgorithms.SHA256,
  sha512: HashAlgorithms.SHA512,
};

export type HashAlgorithm = keyof typeof ALGORITHMS;
