import crypto from 'crypto';

export const encrypt = value => crypto // eslint-disable-line import/prefer-default-export
  .createHmac('sha256', process.env.SECRET)
  .update(value)
  .digest('hex');
