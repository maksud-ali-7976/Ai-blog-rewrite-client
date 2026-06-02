export const buildAbilityFor = (role: any, modules: string[]) => {
  console.log("Building ability for role:", role);
  if (role?.super_admin) {
    return {
      read: true,
      write: true,
      update: true,
      delete: true,
      review: true,
      publish: true,
    };
  }
  const permissions = role?.permissions || {};

  let result = {
    read: false,
    write: false,
    update: false,
    delete: false,
    review: false,
    publish: false,
  };

  for (let module of modules) {
    const abilities = permissions[module];

    if (!abilities) continue;

    result.read = result.read || abilities.includes(1);
    result.write = result.write || abilities.includes(2);
    result.update = result.update || abilities.includes(3);
    result.delete = result.delete || abilities.includes(4);
    result.review = result.review || abilities.includes(5);
    result.publish = result.publish || abilities.includes(6);
  }

  return result;
};
