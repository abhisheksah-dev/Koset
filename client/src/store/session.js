import { useState } from 'react';

export function useOtpState() {
  const [phone, setPhone] = useState('');
  const [nonce, setNonce] = useState('');
  return { phone, setPhone, nonce, setNonce };
}
