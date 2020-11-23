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
  addDriver: {
    url: '/pc/driver/addDriver',
    method: 'post'
  },
  getDriverData: {
    url: '/pc/driver/getDriverByCode',
    method: 'post'
  },
  getDriverList: {
    url: '/pc/driver/listDriver',
    method: 'post'
  },
  editDriver: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  },
  deleteDriver: {
    url: '/pc/driver/deleteDriver',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
