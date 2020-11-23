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
  getMenuList: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  getMenuData: {
    url: '/pc/menu/getMenuByCode',
    method: 'post'
  },
  addMenu: {
    url: '/pc/menu/addMenu',
    method: 'post'
  },
  editMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  },
  deleteMenu: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  }

}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
