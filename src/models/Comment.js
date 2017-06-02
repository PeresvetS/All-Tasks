import Sequelize from 'sequelize';

export default connect => connect.define('Comment', {
  content: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: {
        args: true,
        msg: 'The comment should not be empty.',
      },
      len: {
        args: [1, +Infinity],
        msg: 'The comment must contain at least 1 characters.',
      },
    },
  },
}, {
  freezeTableName: true,
});
