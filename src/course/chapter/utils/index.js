import { getReplayList, getUnitDetail } from '@/api/modules/course/index';
import { baseUrl } from '@/api/config/index';

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
          next: next.concat(
            units.map((item) => {
              return { ...item, isUnit: true };
            })
          ),
        };
      });
    }
    return {
      ...item,
      type,
      next: next.concat(
        units.map((item) => {
          return { ...item, isUnit: true };
        })
      ),
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

//学习单元跳转处理
export const unitType = [
  {
    type: 1,
    name: '视频',
    action: async ({ code, unitId, productId }) => {
      const { body = {} } = await getUnitDetail({ code });
      console.log('ret--', body);

      const { lastPoint, material, videoId } = body;
      return {
        path: '/course/videoUnit/index',
        params: {
          lastPoint,
          material,
          productId,
          videoId,
          code,
          unitId,
          url: `${baseUrl}/h5/#/`,
        },
      };
    },
  },
  {
    type: 0,
    name: '资料',
    action: async ({ code, name }) => {
      const { body = {} } = await getUnitDetail({ code });
      const { material, limit } = body;
      console.log('ret--', body);
      return {
        path: 'MaterialUnit',
        params: {
          material,
          name,
          url: `${baseUrl}/h5/#/pdf`,
          code,
          limit,
        },
      };
    },
  },
  {
    type: 2,
    name: '练习',
    action: async ({ code, name }) => {
      return {
        path: 'Practice',
        params: {
          code,
          name,
        },
      };
    },
  },
  {
    type: 3,
    name: '考试',
    action: async ({ unitId, productId }) => {
      return {
        path: 'ExaminationDetail',
        params: {
          unitId,
          productId,
          isBought: true,
        },
      };
    },
  },
  // 直播跳转方法
  {
    type: 4,
    name: '直播',
    action: async ({ code, productId }) => {
      const res = await getUnitDetail({ code });
      // 待直播与直播中直接跳转直播间地址
      if (res.status === 0 || res.status === 1) {
        return {
          path: 'LiveUnit',
          params: {
            url: res.indexUrl,
            code,
            liveRoomId: res.liveRoomId,
          },
        };
      }
      const re = await getReplayList({ productId, liveRoomId: res.liveRoomId });
      // 回放数量大于1跳转至回放列表
      if (re.length > 1) {
        return {
          path: 'ReplayList',
          params: {
            list: re,
            code,
            liveRoomId: res.liveRoomId,
          },
        };
      } else {
        return {
          path: 'LiveUnit',
          params: {
            // 回放未生成，依然跳直播间
            url: re.length === 0 ? res.indexUrl : re[0].playUrl,
            code,
            liveRoomId: res.liveRoomId,
          },
        };
      }
    },
  },
];
export const navigationFn = async ({ type, code, unitId, productId, name, indexUrl }) =>
  await unitType
    .find((item) => item.type === type)
    ?.action({ code, unitId, productId, name, indexUrl });

// 搜集产品的id
export function getProductIds(data, type = 'P') {
  var result = [];
  function handleData(ids) {
    if (Object.keys(ids).length > 0) {
      ids?.forEach((item) => {
        const { id = '', nodeType = '', next = [] } = item;
        if (nodeType.toUpperCase() === type) {
          result.push(id);
        }
        if (next && next.length > 0) {
          handleData(next);
        }
      });
    }
  }
  handleData(data);
  return result;
}

// 产品树重新组装统计数据
export function assembleData(item, statics) {
  const current = statics?.find((it) => {
    // J-科目类型 P-产品类型 C-章类型 S-节类型 CU-学习单元类型(章) SU-学习单元类型(节)
    // console.log(item.id === it.id && it.nodeType === item.nodeType)
    // nodeType=== CU 和SU   nodetype和id匹配
    // nodeType=== S  nodeType和parentName和name匹配
    // nodeType=== C  nodeType和productId和name匹配
    // nodeType=== p  nodeType和parentId存在，parentId和id一起匹配，不存在直接用id匹配
    switch (item.nodeType) {
      case 'CU':
      case 'SU':
        if (item.id === it.id && item.nodeType === it.nodeType) {
          return true;
        }
        break;
      case 'S':
        if (
          item.name === it.name &&
          item.nodeType === it.nodeType &&
          item.parentName === it.parentName
        ) {
          return true;
        }
        break;
      case 'C':
        if (
          item.name === it.name &&
          item.nodeType === it.nodeType &&
          item.parentId === it.parentId
        ) {
          return true;
        }
        break;
      case 'P':
        if (item.id === it.id && item.nodeType === it.nodeType) {
          return true;
        }
        break;
      default:
        return false;
    }
  });
  if (current) {
    return {
      ...item,
      ...current,
    };
  } else {
    return item;
  }
}
