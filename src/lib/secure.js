import crypto from 'crypto';

/* eslint-disable */
export const encrypt = value => crypto.createHmac('sha256', process.env.SECRET)
  .update(value)
  .digest('hex');
