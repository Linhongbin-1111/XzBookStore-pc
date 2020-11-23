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
  getHomePicList: {
    url: '/pc/rotationChart/listRotationChart',
    method: 'post'
  },
  addHomePic: {
    url: '/pc/rotationChart/addRotationChart',
    method: 'post'
  },
  getCommData: {
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  editHomePicState: {
    url: '/pc/rotationChart/updateStateByCode',
    method: 'post'
  },
  deleteHomePic: {
    url: '/pc/rotationChart/deleteRotationChart',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
