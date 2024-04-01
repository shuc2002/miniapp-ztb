export function flatList(list, type) {
  return list.map((item) => {
    let { next = [], units = [] } = item;
    if (next.length > 0) {
      next = next.map((it) => {
        let { next = [], units = [] } = it;
        if (next.length > 0) {
          next = flatList(next, 2);
        }
        return {
          ...it,
          type,
          children: next.concat(units),
        };
      });
    }
    return {
      ...item,
      type,
      children: next.concat(units),
    };
  });
}

// 0 - 1
// 1  - 0
// 2 -4
// 3 - 2
export const tabEnum = {
  0: 1,
  1: 0,
  2: 4,
  3: 2,
};
