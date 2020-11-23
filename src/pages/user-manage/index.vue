<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择">
          <el-option
          v-for="(item, index) in roleOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
          ></el-option>
          <!-- <el-option label="全部" value="All"></el-option>
          <el-option label="管理员" value="manager"></el-option>
          <el-option label="店长" value="shop-manager"></el-option>
          <el-option label="司机" value="dirver"></el-option> -->
        </el-select>
      </el-form-item>
    </i-search>
    <i-table :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        align="center">
      </el-table-column>
    </i-table>

    <i-dialog  v-model="dialogVisible"
      :title="dialogTitle"
      :showButton="true"
      ref="dialog"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData"
        label-width="120px"
        ref="form"
        :rules="formRules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct" placeholder="请输入用户账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName" placeholder="请输入用户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogFormData.sex" placeholder="请选择性别">
                <!-- <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option> -->
                <el-option
                  v-for="(item, index) in sexList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model.number="dialogFormData.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model="dialogFormData.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="dialogFormData.idCard" placeholder="请输入身份证"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户密码" prop="userPwd">
              <el-input type="password" v-model="dialogFormData.userPwd" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogFormData.role" placeholder="请选择">
                <el-option
                  v-for="(item, index) in dialogRoleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"></el-option>
                <!-- <el-option label="管理员" value="1"></el-option>
                <el-option label="店长" value="2"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="上传头像" prop="photoPath">
              <!-- name是接口请求的字段名 -->
              <el-upload
                ref="upload"
                class="upload-demo"
                action="http://300217906n.picp.vip/pc/uploadImage"
                :limit="1"
                name="file"
                :data="photoToken"
                :on-success="handleAvatarSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/user-manage.js'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        userName: '',
        userAcct: '',
        role: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogFormData: {
        userName: '',
        photoPath: '',
        userAcct: '',
        userPassword: '',
        idCard: '',
        sex: '',
        role: '',
        phone: '',
        email: ''
      },
      photoToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      userCode: '',
      getUserCode: [],
      dialogRoleOptions: [
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'}
      ],
      roleOptions: [
        {label: '全部', value: ''},
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'}
      ],
      sexList: [
        {label: '男', value: '0'},
        {label: '女', value: '1'}
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增用户'
            this.dialogType = 'addUser'
            this.dialogVisible = true
            // console.log('this.dialogVisible')
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getUserCode.length === 0) {
              this.$message.error('请勾选一个需要修改的用户！')
            } else if (this.getUserCode.length === 1) {
              this.dialogTitle = '修改用户信息'
              this.dialogType = 'changeUserInfo'
              this.dialogVisible = true
              this.userCode = this.getUserCode[0].userCode
              this.getUserData()
            } else {
              this.$message.error('一次只能勾选一个需要修改的用户！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            // 删除用户接口
            if (this.getUserCode.length === 0) {
              this.$message.error('请勾选需要删除的用户，可多选！')
            } else if (this.getUserCode.length === 1) {
              this.$confirm('此操作将永久删除该用户，是否继续？').then(() => {
                this.userCode = this.getUserCode[0].userCode
                req('deleteUser', {
                  userCode: this.userCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  }
                })
              }).catch(() => {})
            } else {
              // 遍历多选的用户，放到userCode里
              for (let i = 0; i < this.getUserCode.length; i++) {
                this.userCode = this.getUserCode[i].userCode + ',' + this.userCode
              }
              console.log(this.userCode)
              this.$confirm('此操作将永久删除选中的用户，是否继续？').then(() => {
                req('deleteUser', {
                  userCode: this.userCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  }
                })
              }).catch(() => {})
            }
          }
        }
      ],
      columnList: [
        {label: '账号', prop: 'userAcct', width: '130px'},
        {label: '姓名', prop: 'userName', width: '130px'},
        {label: '角色', prop: 'role', distName: 'roleOptions', width: '120px'},
        {label: '性别', prop: 'sex', distName: 'sexList', width: '100px'},
        {label: '手机', prop: 'phone', width: '150px'},
        {label: '邮箱', prop: 'email', width: '190px'},
        {label: '身份证', prop: 'idCard', width: '228px'}
      ],
      tableData: [
      ],
      multipleSelection: [],
      formRules: {
        userAcct: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { type: 'number', message: '手机号码必须为数字', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        idCard: [
          // { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: this.validateIdCard, trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 6, max: 18, message: '密码长度为6-18' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
      // file: [{
      //   name: '',
      //   url: ''
      // }]
    }
  },
  mounted () {
    this.fetch() // 实时从接口获取最新的用户列表
  },
  computed: {
  },
  methods: {
    // 获取上传成功返回的地址
    handleAvatarSuccess (res) {
      this.dialogFormData.photoPath = res.data.url
      // console.log('res', res)
      // console.log(this.dialogFormData.photoPath)
    },
    // fetch让每次搜索都从第一页开始搜索
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    // 查询表格数据
    search () {
      // 服务器请求的数据
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        // 获取服务器响应的数据
        console.log('用户信息', data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        data.data.list.forEach(item => {
          if (item.sex === '0') {
            item.sex = '男'
          } else {
            item.sex = '女'
          }
        })
        data.data.list.forEach(item => {
          if (item.role === '1') {
            item.role = '管理员'
          } else if (item.role === '2') {
            item.role = '店长'
          }
        })
        // console.log(data.data)
      })
    },
    // 上传图片
    uploadImage () {
      // 服务器请求的数据
      req('uploadImage', {
        file: this.file
      }).then(data => {
        // this.dialogFormData.photoPath = data.data.photoPath
        // console.log(data)
      })
    },
    // 修改用户信息时，获取用户信息显示到dialog
    getUserData () {
      // 服务器请求的数据
      req('getUserData', {
        userCode: this.userCode
      }).then(data => {
        // 从服务器获取的数据this.dialogFormData
        console.log(data)
        this.dialogFormData = Object.assign({}, data.data)
        // 把获取的字符串手机号改为数字
        this.dialogFormData.phone = parseInt(data.data.phone)
      })
    },
    // 重置按钮
    reset () {
      this.fetch()
      // console.log('重置按钮被点击')
    },
    // 控制每页显示多少条数据
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
      console.log('每页多少条', value)
    },
    // 当前第几页
    handleCurrentChange (value) {
      console.log('当前第几页', value)
      this.pageInfo.pageIndex = value
      this.search()
    },
    // 多选框
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getUserCode = rows
    },
    // 对话框取消按钮
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
      this.$refs.form.resetFields()
    },
    // 对话框确定按钮
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addUser') {
            console.log('表单校验通过了')
            req('addUser', {
              ...this.dialogFormData
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.$refs.upload.clearFiles()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'changeUserInfo') {
            req('changeUserInfo', {
              ...this.dialogFormData,
              userCode: this.userCode
            }).then(data => {
              // this.dialogFormData = Object.assign({}, data.data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.$refs.upload.clearFiles()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 对话框右上角关闭按钮
    dialogBeforeClose () {
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    // columnFormatter (row, column, cellValue, index) {
    //   let distName = this.columnList.filter(item => {
    //     return item.prop === column.property
    //   })[0].distName

    //   if (distName) {
    //     return this[distName].filter(item => {
    //       return item.value === row[column.property]
    //     })[0].label
    //   } else {
    //     return row[column.property]
    //   }
    // },
    validateIdCard (rule, value, callback) {
      if (value !== '') {
        let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        // console.log(reg.test(value))
        if (!reg.test(value)) {
          callback(new Error('请输入正确的身份证号！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
// .el-input {
//   // .el-input__inner {
//   // }
// }
</style>
