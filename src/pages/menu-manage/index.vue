<template>
  <div class="comm-classify">
    <div class="comm-classify-menu">
      <div class="comm-classify-btnlist">
        <el-button
          v-for="(item, index) in toolbar"
          :key="index"
          :type="item.type"
          @click="item.func">
          {{ item.btnName }}
        </el-button>
      </div>
      <div class="comm-classify-list">
        <el-container>
          <el-aside width="100%">
            <el-menu>
              <el-menu-item v-for="(item,index) in menuList"
                :index="item.menuCode"
                :key="index"
                @click="getMenuCode(item)">
                <span>
                  {{ item.menuName }}
                </span>
              </el-menu-item>
            </el-menu>
          </el-aside>
        </el-container>
      </div>
    </div>
    <div class="comm-classify-info">
      <div class="comm-classify-title">分类详情</div>
        <!-- <el-form :model="menuData"
          label-width="120px"
          ref="formData">
          <el-row>
            <el-col :span="10">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="menuData.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="菜单路由" prop="menuRoute">
                <el-input v-model="menuData.menuRoute"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="menuData.remarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->
        <!-- <div>
          <span>菜单名称</span>
          <div>{{menuDetail.menuDetailName}}</div>
        </div>
        <div>
          <span>菜单路由</span>
          <div>{{menuDetail.menuDetailRoute}}</div>
        </div>
        <div>
          <span>备注</span>
          <div>{{menuDetail.remarks}}</div>
        </div> -->
        <div class="comm-classify-form">
          <el-form ref="detailForm" :model="menuDetailFormData" :inline="true" label-width="100px">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuDetailFormData.menuName" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="菜单路由" prop="menuRoute">
              <el-input v-model="menuDetailFormData.menuRoute" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="menuDetailFormData.remarks" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
    </div>
    <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    :showButton="true"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeClose">
    <el-form :model="dialogFormData"
      label-width="120px"
      ref="form"
      :rules="formRules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="名称" prop="menuName">
            <el-input v-model="dialogFormData.menuName" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="路径" prop="menuRoute">
            <el-input v-model="dialogFormData.menuRoute" placeholder="请输入菜单路径"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="备注" prop="remarks">
            <el-select v-model="dialogFormData.remarks" placeholder="店长是否可见">
              <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>
  </div>
</template>

<script>
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/menu-manage.js'

export default {
  name: 'menu-manage',
  components: {
    IDialog
  },
  data () {
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogFormData: {
        menuName: '',
        menuRoute: '',
        remarks: ''
      },
      // 用于将新增对话框内容置空
      addDialogFormData: {
        menuName: '',
        menuRoute: '',
        remarks: ''
      },
      // 菜单详情
      menuDetailFormData: {
        menuName: '',
        menuRoute: '',
        remarks: ''
      },
      clickMenuCode: '',
      clickMenuVersion: '',
      clickMenuName: '',
      // 菜单详情
      // menuDetail: {
      //   menuDetailName: '',
      //   menuDetailRoute: '',
      //   remarks: ''
      // },
      roleOptions: [
        {label: '店长可见', value: '2'},
        {label: '店长不可见', value: '1'}
      ],
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增菜单'
            this.dialogType = 'addMenu'
            this.dialogFormData = this.addDialogFormData
            // console.log(this.clickMenuCode)
            // console.log(this.dialogVisible)
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.clickMenuVersion === '') {
              this.$message.error('请勾选一个菜单！')
            } else {
              this.dialogVisible = true
              this.dialogTitle = '修改菜单信息'
              this.dialogType = 'editMenu'
              // 获取菜单详情显示到对话框
              this.getMenuCode()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.clickMenuCode === '') {
              this.$message.error('请点击需要删除的菜单！')
            } else {
              this.$confirm('此操作将永久删除“' + this.clickMenuName + '”菜单，是否继续？').then(() => {
                req('deleteMenu', {
                  menuCode: this.clickMenuCode
                }).then(data => {
                  // console.log(this.clickMenuCode)
                  if (data.code === 0) {
                    this.$message.success(data.msg)
                    this.search()
                  } else {
                    this.$message.error(data.msg)
                  }
                }).catch(() => {
                  this.$message.info('已取消！')
                })
              })
            }
          }
        },
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            // console.log(this)
          }
        }
      ],
      // menuList: [
      //   {title: '用户管理', path: '/user-manage'},
      //   {title: '菜单管理', path: '/menu-manage'},
      //   {title: '商品管理', path: '/comm-manage'},
      //   {title: '首页轮播图管理', path: '/home-pic-manage'},
      //   {title: '商品分类管理', path: '/comm-classify-manage'},
      //   {title: '客户管理', path: '/client-manage'},
      //   {title: '订单管理', path: '/order-manage'},
      //   {title: '热门位商品管理', path: '/hot-comm-manage'},
      //   {title: '门店信息管理', path: '/shop-info-manage'},
      //   {title: '司机信息管理', path: '/driver-info-manage'}
      // ],
      menuList: {
      },
      // menuData: {
      //   menuName: '',
      //   menuCode: '',
      //   menuRoute: '',
      //   remarks: ''
      // },
      formRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menuRoute: [
          { required: true, message: '请输入菜单路由', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请选择店长是否可见', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.search()
  },
  // created () {
  // },
  methods: {
    // 获取菜单列表
    search () {
      req('getMenuList', {
        // ...this.menuList
      }).then(data => {
        console.log(data)
        this.menuList = data.data
        // console.log('menuList', this.menuList)
        // console.log(this.clickMenuVersion)
      })
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addMenu') {
            // console.log('表单校验通过了')
            req('addMenu', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.search()
                this.$refs.form.resetFields()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editMenu') {
            req('editMenu', {
              ...this.dialogFormData,
              menuCode: this.clickMenuCode,
              version: this.clickMenuVersion
            }).then(data => {
              if (data.code === 0) {
                // this.created()
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.search()
              }
            })
          } else {
            return false
          }
        }
      })
    },
    dialogBeforeClose () {
      // console.log(111)
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    // 点击菜单获取菜单编号
    getMenuCode (item) {
      // console.log(item)
      this.clickMenuCode = item.menuCode
      this.clickMenuName = item.menuName
      this.clickMenuVersion = item.version
      // console.log(this.clickMenuCode)
      // 获取菜单详情
      req('getMenuData', {
        menuCode: this.clickMenuCode
      }).then(data => {
        // console.log('haha', data)
        this.menuDetailFormData = Object.assign({}, data.data)
        this.dialogFormData = Object.assign({}, data.data)
        // })
        if (this.menuDetailFormData.remarks === '2') {
          this.menuDetailFormData.remarks = '店长可见'
        } else {
          this.menuDetailFormData.remarks = '店长不可见'
        }
      })
      // return this.clickUserCode
    }
  }
}
</script>

<style lang='scss' scoped>
.comm-classify {
  width: 1280px;
  height: 600px;
  display: flex;
  .comm-classify-menu {
    width: 30%;
    height: 100%;
    .comm-classify-btnlist {
      width: 100%;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
    }
    .comm-classify-list {
      width: 100%;
      height: 500px;
      text-align: left;
      padding-left: 15px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      .el-menu-item {
        height: 35px;
        line-height: 35px;
      }
    }
  }
  .comm-classify-info {
    width: 70%;
    height: 100%;
    .comm-classify-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: left;
      font-size: 20px;
      border: 1px solid rgb(228, 228, 228);
      padding-left: 30px;
      box-sizing: border-box;
    }
    .comm-classify-form {
      width: 100%;
      height: 500px;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      .el-form {
        padding-top: 20px;
        box-sizing: border-box;
        .el-form-item__label {
          width: 80px;
        }
        .el-form-item__content {
          .el-input__inner {
            width: 80%;
          }
        }
      }
      >div {
        display: flex;
        margin: 20px 35px;
        span {
          width: 70px;
          height: 30px;
          line-height: 30px;
        }
        >div {
          width: 200px;
          height: 30px;
          line-height: 30px;
          margin-left: 15px;
          padding: 0 10px;
          border: 1px solid rgb(228, 228, 228);
        }
      }
    }
  }
}
</style>
