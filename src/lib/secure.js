import crypto from 'crypto';

export const encrypt = value => crypto.createHmac('sha256', process.env.SECRET) // eslint-disable-line import/prefer-default-export
  .update(value)
  .digest('hex');
