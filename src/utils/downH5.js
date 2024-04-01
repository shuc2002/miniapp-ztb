export const downH5 = (url) => {
  fetch(url, {
    method: 'get',
    responseType: 'arraybuffer',
  })
    .then(function (res) {
      if (res.status !== 200) {
        return res.json();
      }
      return res.arrayBuffer();
    })
    .then((blobRes) => {
      // 生成 Blob 对象，设置 type 等信息
      const e = new Blob([blobRes], {
        type: 'application/octet-stream',
        'Content-Disposition': 'attachment',
      });
      // 将 Blob 对象转为 url
      const link = window.URL.createObjectURL(e);
      let a = document.createElement('a');
      a.href = link;
      a.download = '证书.png';
      a.click();
    })
    .catch((err) => {
      console.error(err);
    });
};
