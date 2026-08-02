import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Divider } from 'antd';
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  UniqueIdentifier,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

import { MenuKeys } from '@/renderer/layouts/routes';
import { useConfigData, useMenus } from '@/renderer/hooks';
import AppItem from './AppItem';
import styles from './index.module.less';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export type TMenus = {
  sider: any[];
  other: any[];
};

const Applications = () => {
  const { data: configData, setData: setConfigData } = useConfigData();
  const menusMap = useMenus();
  // 过滤掉持久化配置中已不存在的菜单 key，避免幽灵项渲染/参与拖拽
  const filterValidMenus = (keys: any[]) => keys.filter((key) => menusMap.has(key));
  const newMenus = MenuKeys.filter(
    (key) => !configData?.sider_menus.includes(key) && !configData?.other_menus.includes(key),
  );
  const [menus, setMenus] = useState<TMenus>({
    sider: filterValidMenus(configData?.sider_menus || []),
    other: [...filterValidMenus(configData?.other_menus || []), ...newMenus],
  });

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const handleActive = (key: string) => {
    setConfigData({
      active_menu_key: key,
      more_active_menu_key: key,
    });
  };

  function renderSortableItemDragOverlay(id: any) {
    return <AppItem key={id} id={id} />;
  }

  const findContainer = (id: any): keyof TMenus => {
    if (id in menus) return id;
    const container = Object.keys(menus).find((key) => menus[key as keyof TMenus].includes(id));
    return container as keyof TMenus;
  };

  const handleMenusSwitch = (menus: TMenus) => {
    setConfigData({
      sider_menus: filterValidMenus(menus.sider),
      other_menus: filterValidMenus(menus.other),
    });
  };
  return (
    <DndContext
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={({ active }) => {
        setActiveId(active.id);
      }}
      onDragOver={({ active, over }) => {
        const overId = over?.id;
        const activeId = active.id;

        const overContainer = findContainer(overId);
        const activeContainer = findContainer(activeId);
        if (!overContainer || !activeContainer) {
          return;
        }

        if (activeContainer !== overContainer) {
          setMenus((menus) => {
            const activeItems = menus[activeContainer];
            const overItems = menus[overContainer];
            const overIndex = overItems.indexOf(overId);
            const activeIndex = activeItems.indexOf(active.id);

            // 拖拽项不在当前列表（可能已被移除），跳过，避免把 undefined 写进数组
            if (activeIndex < 0) {
              return menus;
            }

            const isBelowOverItem =
              over &&
              active.rect.current.translated &&
              active.rect.current.translated.top > over.rect.top + over.rect.height;

            const modifier = isBelowOverItem ? 1 : 0;
            const newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

            const newMenus = {
              ...menus,
              [activeContainer]: menus[activeContainer].filter((item) => item !== active.id),
              [overContainer]: [
                ...menus[overContainer].slice(0, newIndex),
                menus[activeContainer][activeIndex],
                ...menus[overContainer].slice(newIndex, menus[overContainer].length),
              ],
            };
            handleMenusSwitch(newMenus);
            return newMenus;
          });
        }
      }}
      onDragEnd={({ active, over }) => {
        const overId = over?.id;
        const activeId = active.id;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);
        if (!activeContainer) {
          setActiveId(null);
          return;
        }

        if (overId == null) {
          setActiveId(null);
          return;
        }

        if (overContainer) {
          const activeIndex = menus[activeContainer].indexOf(activeId);
          const overIndex = menus[overContainer].indexOf(overId);
          if (activeIndex !== overIndex) {
            setMenus((menus) => {
              const newMenus = {
                ...menus,
                [overContainer]: arrayMove(menus[overContainer], activeIndex, overIndex),
              };
              handleMenusSwitch(newMenus);
              return newMenus;
            });
          }
        }
        setActiveId(null);
      }}
    >
      <div className={styles['applications']}>
        <SortableContext items={menus.sider}>
          <div className={styles['applications-quick-apps']}>
            <span className={styles['applications-quick-apps-tip']}>快捷键：</span>
            <div className={styles['applications-quick-apps-wrap']}>
              {menus.sider.map((key, index) => {
                return <AppItem key={key} id={key} index={index} onClick={handleActive} />;
              })}
            </div>
          </div>
        </SortableContext>

        <SortableContext items={menus.other}>
          <Divider>全部应用</Divider>
          <div className={styles['applications-quick-apps-wrap']}>
            {menus.other.map((key, index) => {
              return <AppItem key={key} id={key} index={index} onClick={handleActive} />;
            })}
          </div>
        </SortableContext>
      </div>
      {createPortal(
        <DragOverlay adjustScale={false} dropAnimation={dropAnimation}>
          {activeId ? renderSortableItemDragOverlay(activeId) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
};

export default Applications;
