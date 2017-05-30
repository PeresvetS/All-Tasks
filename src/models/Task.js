  import Sequelize from 'sequelize';

  export default connect => connect.define('Task', {
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The name of task should not be empty.',
        },
      },
    },
    description: {
      type: Sequelize.TEXT,
    },
    statusId: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The status should not be empty.',
        },
        max: 4,
      },
    },
    creatorId: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    assignedToId: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'The assignedTo should not be empty.',
        },
      },
    },
  }, {
    getterMethods: {
      getStatusId: async function statusId() {
        const status = await this.getStatus();
        return status.dataValues.id;
      },
      getStatusName: async function statusName() {
        const status = await this.getStatus();
        return status.dataValues.name;
      },
      getStatusAvatar: async function statusAvatar() {
        const status = await this.getStatus();
        return status.dataValues.statusAvatar;
      },
    },
    freezeTableName: true,
  });
