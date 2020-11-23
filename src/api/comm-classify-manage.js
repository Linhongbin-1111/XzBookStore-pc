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
  getCommClassifyList: {
    url: '/pc/goodsSort/goodsSortList',
    method: 'post'
  },
  addCommClassify: {
    url: '/pc/goodsSort/addGoodsSort',
    method: 'post'
  },
  getCommClassifyData: {
    url: '/pc/goodsSort/getSortByCode',
    method: 'post'
  },
  editCommClassify: {
    url: '/pc/goodsSort/updateGoodsSort',
    method: 'post'
  },
  deleteCommClassify: {
    url: '/pc/goodsSort/deleteGoodsSort',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
