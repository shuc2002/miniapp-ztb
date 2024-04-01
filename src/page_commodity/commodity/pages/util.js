// 树点击
export function handleLoop(data, key = -1, index = -1, sign = -1) {
  if ((key > -1) & (index == -1)) {
    data[key].checked = !data[key].checked;
  } else if ((key > -1) & (index > -1) & (sign == -1)) {
    data[key].constructs[index].checked = !data[key].constructs[index].checked;
  } else if ((key > -1) & (index > -1) & (sign > -1)) {
    data[key].constructs[index].next[sign].checked =
      !data[key].constructs[index].next[sign].checked;
  }
}
// 树增加判断节点字段checked
export function setChecked(treeList) {
  treeList?.map((item, key) => {
    if (key == 0) {
      item.checked = true;
    } else {
      item.checked = false;
    }
    if (item.constructs?.length > 0) {
      item.constructs.map((data) => {
        if (key == 0) {
          data.checked = true;
        } else {
          data.checked = false;
        }
        if (data.next?.length > 0) {
          data.next.map((val) => {
            if (key == 0) {
              val.checked = true;
            } else {
              val.checked = false;
            }
          });
        }
      });
    }
  });
  return treeList;
}
