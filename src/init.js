import connect from './db';
import getModels from './models';

export default async () => {
  const models = getModels(connect);

  await models.User.sync({ force: true });
  await models.Task.sync({ force: true });
  await models.Tag.sync({ force: true });
  await models.Comment.sync({ force: true });
  await models.TaskStatus.sync({ force: true });
  await models.TaskTag.sync({ force: true });
  await models.TaskStatus.bulkCreate([
    { name: 'New', statusAvatar: '/images/new.jpg' },
    { name: 'In process', statusAvatar: '/images/inprocess.jpg' },
    { name: 'Testing', statusAvatar: '/images/testing.jpg' },
    { name: 'Completed', statusAvatar: '/images/complited.jpg' },
  ]);
  await models.User.bulkCreate([
    { email: 'test@test.com', firstName: 'test', lastName: 'test', password: 'test123' },
    { email: 'user@user.com', firstName: 'user', lastName: 'user', password: 'user123', avatar: '/images/user.jpg' },
  ]);
};
