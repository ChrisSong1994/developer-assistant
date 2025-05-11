import routes from '@/renderer/layouts/routes';
const useMenus = () => {
  const menusMap = new Map();
  for (let route of routes) {
    menusMap.set(route.key, {
      key: route.key,
      title: route.title,
      icon: route.icon,
    });
  }

  return menusMap;
};

export default useMenus;
