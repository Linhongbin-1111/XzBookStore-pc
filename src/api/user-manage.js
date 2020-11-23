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
  getTableData: {
    url: '/pc/user/listUsers',
    method: 'post'
  },
  addUser: {
    url: '/pc/user/addUser',
    method: 'post'
  },
  uploadImage: {
    url: '/pc/uploadImage',
    method: 'post'
  },
  getUserData: {
    url: '/pc/user/getUserByUserCode',
    method: 'post'
  },
  changeUserInfo: {
    url: '/pc/user/updateUser',
    method: 'post'
  },
  deleteUser: {
    url: '/pc/user/deleteUser',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
