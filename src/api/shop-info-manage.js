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
  getProvince: {
    url: '/pc/store/getProvince',
    method: 'post'
  },
  getCity: {
    url: '/pc/store/getCity',
    method: 'post'
  },
  getArea: {
    url: '/pc/store/getArea',
    method: 'post'
  },
  addStore: {
    url: '/pc/store/addStore',
    method: 'post'
  },
  getStoreByStoreCode: {
    url: '/pc/store/getStoreByStoreCode',
    method: 'post'
  },
  listStore: {
    url: '/pc/store/listStore',
    method: 'post'
  },
  editStore: {
    url: '/pc/store/updateStore',
    method: 'post'
  },
  deleteStore: {
    url: '/pc/store/deleteStore',
    method: 'post'
  }
}
const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
