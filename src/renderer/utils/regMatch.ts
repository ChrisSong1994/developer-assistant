import _ from 'lodash';

export interface IRegMatchedGroupData {
  index: number; // 匹配到的下标范围
  length: number; // 匹配值长度
  value: string; // 匹配值
  key: number | string; // 匹配的 group key
}

export interface IRegMatchedData {
  index: number; // 匹配到的下标范围
  length: number; // 匹配值长度
  value: string; // 匹配值
  key: number | string; // 匹配到的下标
  groups: Array<IRegMatchedGroupData> | null;
}

// 需要继续优化，计算出分组key 和下标
const parseRegMatchedGroups = (
  matchedValue: string,
  matchedIndex: number,
  matchedGroups: Record<string, string>,
  matchedGroupsValues: Array<string>,
): Array<IRegMatchedGroupData> => {
  const calculateGroupValues: Array<IRegMatchedGroupData> = [];

  for (const [index, value] of matchedGroupsValues.entries()) {
    if (value === undefined) continue;
    let groupIndex = matchedValue.indexOf(value);

    const calculateGroupValue = _.findLast(calculateGroupValues, (v) => v.value === value);

    // 假如存在已经计算好的相同group值
    if (calculateGroupValue) {
      groupIndex = matchedValue.indexOf(value, calculateGroupValue.index++); // 从上个重复group值后计算
    }

    calculateGroupValues.push({
      index: groupIndex,
      length: value.length,
      value: value,
      key: index + 1, // 展示num
    });
  }
  return calculateGroupValues;
};

// 正则匹配
const regMatch = (reg: RegExp, str: string) => {
  const matcheds = [];
  if (reg.global) {
    matcheds.push(...str.matchAll(reg));
  } else {
    matcheds.push(str.match);
  }

  const result = matcheds.filter(Boolean).map((item: any, index: number) => {
    const matchedGroupsValues: Array<string> = Array.from(item as RegExpMatchArray).slice(1);
    const matched: IRegMatchedData = {
      index: item.index,
      length: item[0].length,
      value: item[0],
      key: index + 1, // 展示num
      groups: null,
    };
    // 解析匹配分组数据
    if (matchedGroupsValues.length) {
      matched.groups = parseRegMatchedGroups(matched.value, matched.index, item.groups, matchedGroupsValues);
    }
    return matched;
  });

  return result;
};

export default regMatch;
