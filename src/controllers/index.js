import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import error from './error';

const controllers = [welcome, users, sessions, error];

export default (router, container) => controllers.forEach(f => f(router, container));
