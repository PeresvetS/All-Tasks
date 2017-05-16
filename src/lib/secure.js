import crypto from 'crypto';

const secret = 'abcdefg';
/* eslint-disable */
export const encrypt = value => crypto.createHmac('sha256', secret)
  .update(value)
  .digest('hex');
