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
  getCommList: {
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  getFirstSortCode: {
    url: '/pc/goods/getFirstSortCode',
    method: 'post'
  },
  getSecondSortCode: {
    url: '/pc/goods/getSecondSortCode',
    method: 'post'
  },
  uploadImage: {
    url: '/pc/uploadImage',
    method: 'post'
  },
  addComm: {
    url: '/pc/goods/addGoods',
    method: 'post'
  },
  getCommData: {
    url: '/pc/goods/getGoodsByGoodsCode',
    method: 'post'
  },
  editComm: {
    url: '/pc/goods/updateGoods',
    method: 'post'
  },
  deleteComm: {
    url: '/pc/goods/deleteGoods',
    method: 'post'
  },
  editCommState: {
    url: '/pc/goods/updateStateByGoodsCode',
    method: 'post'
  }

}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
