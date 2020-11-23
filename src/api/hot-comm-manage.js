import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getHotCommList: {
    url: '/pc/hotGoods/listHotGoods',
    method: 'post'
  },
  addHotComm: {
    url: '/pc/hotGoods/addHotGoods',
    method: 'post'
  },
  getHotCommData: {
    url: '/pc/hotGoods/getHotGoodsByCode',
    method: 'post'
  },
  editHotComm: {
    url: '/pc/hotGoods/updateHotGoods',
    method: 'post'
  },
  getHotCommShowNumber: {
    url: '/pc/hotGoods/getShowNumber',
    method: 'post'
  },
  editHotCommShowNumber: {
    url: '/pc/hotGoods/updeteShowNumber',
    method: 'post'
  },
  deleteHotComm: {
    url: '/pc/hotGoods/deleteHotGoods',
    method: 'post'
  },
  getCommData: {
    url: '/pc/goods/listGoods',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
