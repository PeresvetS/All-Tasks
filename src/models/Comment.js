import Sequelize from 'sequelize';

export default connect => connect.define('Comment', {
  content: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: {
        args: true,
        msg: 'The comment should not be empty.',
      },
    },
  },
}, {
  getterMethods: {
    getUserName: async function userName() {
      const user = await this.getUser();
      return user.fullName;
    },
    getUserAvatar: async function userAvatar() {
      const user = await this.getUser();
      return user.dataValues.avatar;
    },
    getUserId: async function userId() {
      const user = await this.getUser();
      return user.dataValues.id;
    },
    getTaskId: async function taskId() {
      const task = await this.getTask();
      return task.dataValues.id;
    },
  },
  freezeTableName: true,
});
