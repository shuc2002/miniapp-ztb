// 集合：错题&收藏
import { defHttp } from '@/api/request/newIndex';

enum Api {
  // 错题
  Wrong = '/resource/my/mistakes',
  WrongQue = '/resource/my/mistake/content',
  RemoveWrong = '/resource/my/mistakes/remove',
  // 收藏
  Favorite = '/resource/my/collection',
  AddFavorite = '/resource/my/collect',
  FavoriteQue = '/resource/my/collection/content',
  RemoveFavorite = '/resource/my/collection/remove',
  // 收藏错题
  FavWrong = '/resource/my/collect/mistake',
  // 提交收藏集答案
  SaveSubmit = '/resource/my/collect/submit',
  SaveWrong = '/resource/my/mistakes/submit',
}

// 错题首页
export const getWrongList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Wrong,
      data,
    })
  );
};
// 错题内容
export const getWrongQuestion = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.WrongQue,
      data,
    })
  );
};
// 删除错题
export const removeWrong = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.RemoveWrong + `?questionId=${data.questionId}&index=${data.index}`,
    })
  );
};
// 收藏首页
export const getFavoriteList = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.Favorite,
      data,
    })
  );
};
// 收藏内容
export const getFavoriteQuestion = (data: any) => {
  return Promise.resolve(
    defHttp.get({
      url: Api.FavoriteQue,
      data,
    })
  );
};
// 新增收藏
export const addFavorite = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.AddFavorite + `?id=${data.id}&code=${data.code}&index=${data.index}`,
    })
  );
};
// 删除收藏
export const removeFavorite = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.RemoveFavorite + `?questionId=${data.questionId}&index=${data.index}`,
    })
  );
};
// 收藏错题
export const favoriteWrong = (data: any) => {
  return Promise.resolve(
    defHttp.put({
      url: Api.FavWrong + `?questionId=${data.questionId}&index=${data.index}`,
    })
  );
};
//提交收藏集答案
export const saveSubmit = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.SaveSubmit,
      data,
    })
  );
};
//提交错题集答案
export const saveWrong = (data: any) => {
  return Promise.resolve(
    defHttp.post({
      url: Api.SaveWrong,
      data,
    })
  );
};
