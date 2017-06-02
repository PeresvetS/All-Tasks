import lunr from 'lunr';

export default (requestKey, allTasks) => {
  const idx = lunr(function () { // eslint-disable-line func-names
    this.ref('id');
    this.field('name');
    this.field('description');

    allTasks.forEach(function (obj) {  // eslint-disable-line func-names
      this.add(obj);
    }, this);
  });
  const response = idx.search(requestKey);
  const tasksId = response
  .reduce((acc, obj) => {
    const [arr] = Object.entries(obj)
  .filter(el => el[0] === 'ref');
    const id = arr[1];
    return [...acc, Number(id)];
  }, []);
  return tasksId;
};
