import crypto from 'crypto';

/* eslint-disable */
export const encrypt = value => crypto.createHmac('sha256', secret)
  .update(value)
  .digest('hex');
