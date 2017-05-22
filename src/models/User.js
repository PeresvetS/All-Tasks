import Sequelize from 'sequelize';
import { encrypt } from '../lib/secure';

export default connect => connect.define('user_info', {
  email: {
    type: Sequelize.STRING,
    unique: {
      args: true,
      msg: 'This email already use.',
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'The email is invalid.',
      },
      notEmpty: {
        args: true,
        msg: 'The email should not be empty.',
      },
    },
  },
  passworddigest: {
    type: Sequelize.STRING,
    validate: {
      notEmpty: true,
    },
  },
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name',
    validate: {
      len: {
        args: [3, +Infinity],
        msg: 'The password must contain at least 3 characters.',
      },
      notEmpty: {
        args: true,
        msg: 'Please enter your first name.',
      },
    },
  },
  lastName: {
    type: Sequelize.STRING,
    field: 'last_name',
    validate: {
      len: {
        args: [3, +Infinity],
        msg: 'The password must contain at least 3 characters.',
      },
      notEmpty: {
        args: true,
        msg: 'Please enter your last name.',
      },
    },
  },
  password: {
    type: Sequelize.VIRTUAL,
    set: function set(value) {
      this.setDataValue('passworddigest', encrypt(value));
      this.setDataValue('password', value);
      return value;
    },
    validate: {
      len: {
        args: [6, +Infinity],
        msg: 'The password must contain at least 6 characters.',
      },
    },
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: '/images/default.png',
  },
}, {
  getterMethods: {
    fullName: function fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  freezeTableName: true, // Model tableName will be the same as the model name
});
