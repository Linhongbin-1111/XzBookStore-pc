<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="司机编号" prop="userCode">
        <el-input v-model="formData.userCode"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provinceCode">
        <el-select v-model="formData.provinceCode"
          placeholder="请选择"
          @focus="getProvince"
          @change="getCity(formData.provinceCode)">
          <el-option v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.fieldValue"
            :value="item.fieldCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityCode">
        <el-select v-model="formData.cityCode"
          placeholder="请选择"
          @change="getArea(formData.cityCode)">
          <el-option v-for="(item, index) in cityOptions"
            :key="index"
            :label="item.fieldValue"
            :value="item.fieldCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaCode">
        <el-select v-model="formData.areaCode" placeholder="请选择">
          <el-option v-for="(item, index) in areaOptions"
            :key="index"
            :label="item.fieldValue"
            :value="item.fieldCode"></el-option>
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
        align="center">
        </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    :showButton="true"
    width="200px"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeClose">
    <el-form :model="dialogFormData"
      label-width="120px"
      ref="form"
      :rules="formRules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="司机姓名" prop="userName">
            <el-input v-model="dialogFormData.userName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.number="dialogFormData.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="司机账号" prop="userAcct">
            <el-input v-model="dialogFormData.userAcct"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="密码" prop="userPassword">
            <el-input type="password" v-model="dialogFormData.userPassword"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="dialogFormData.idCard"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在省份" prop="provinceCode">
            <el-select v-model="dialogFormData.provinceCode"
              placeholder="请选择"
              @focus="getProvince"
              @change="getCity(dialogFormData.provinceCode)">
              <el-option v-for="(item, index) in provinceOptions"
                :key="index"
                :label="item.fieldValue"
                :value="item.fieldCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在城市" prop="cityCode">
            <el-select v-model="dialogFormData.cityCode"
              placeholder="请选择"
              @change="getArea(dialogFormData.cityCode)">
              <el-option v-for="(item, index) in cityOptions"
                :key="index"
                :label="item.fieldValue"
                :value="item.fieldCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在区" prop="areaCode">
            <el-select v-model="dialogFormData.areaCode"
              placeholder="请选择">
              <el-option v-for="(item, index) in areaOptions"
                :key="index"
                :label="item.fieldValue"
                :value="item.fieldCode"></el-option>
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
import req from '@/api/driver-info-manage.js'

export default {
  name: 'dirver-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      role: '',
      getDriverCode: [],
      userCode: '',
      provinceOptions: [],
      cityOptions: [],
      areaOptions: [],
      photoToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      formData: {
        userCode: '',
        userName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      dialogVisible: false,
      dialogTitle: '新增司机',
      dialogType: 'addDriver',
      dialogFormData: {
        userName: '',
        phone: '',
        photoPath: '',
        userAcct: '',
        userPassword: '',
        idCard: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            console.log(this)
          }
        },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增司机'
            this.dialogType = 'addDriver'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getDriverCode.length === 0) {
              this.$message.error('请勾选一个需要修改的司机！')
            } else if (this.getDriverCode.length === 1) {
              this.dialogTitle = '修改司机信息'
              this.dialogType = 'editDriver'
              this.dialogVisible = true
              this.userCode = this.getDriverCode[0].userCode
              this.getDriverData()
            } else {
              this.$message.error('一次只能勾选一个需要修改的司机！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getDriverCode.length === 0) {
              this.$message.error('请勾选需要删除的司机，可多选！')
            } else if (this.getDriverCode.length === 1) {
              this.$confirm('此操作将永久删除该司机，是否继续？').then(() => {
                this.userCode = this.getDriverCode[0].userCode
                req('deleteDriver', {
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
              for (let i = 0; i < this.getDriverCode.length; i++) {
                this.userCode = this.getDriverCode[i].userCode + ',' + this.userCode
              }
              // console.log(this.userCode)
              this.$confirm('此操作将永久删除选中的司机，是否继续？').then(() => {
                req('deleteDriver', {
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
        {label: '司机编号', prop: 'userCode'},
        {label: '姓名', prop: 'userName'},
        {label: '手机', prop: 'phone'},
        {label: '身份证', prop: 'idCard'},
        {label: '账号', prop: 'userAcct'}
      ],
      tableData: [
      ],
      multipleSelection: [],
      formRules: {
        userName: [
          { required: true, message: '请输入司机姓名', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { type: 'number', message: '手机号码必须为数字' }
        ],
        userAcct: [
          { required: true, message: '请输入司机账号', trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { validator: this.validateIdCard, trigger: 'bulr' }
        ],
        provinceCode: [
          { required: true, message: '请选择省份', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        // areaCode: [
        //   { required: true, message: '请选择地区', trigger: 'change' }
        // ],
        photoPath: [
          { required: true, message: '请选择头像', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
    this.showButton()
  },
  computed: {
  },
  methods: {
    showButton () {
      if (JSON.parse(sessionStorage.getItem('roleInfo')).role === '2') {
        this.toolbar = [
          {
            btnName: '详情',
            type: 'primary',
            func: () => {
              console.log(this)
            }
          }
        ]
      }
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      this.role = this.getRole
      req('getDriverList', {
        ...this.formData,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log('司机信息', data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 获取省信息
    getProvince () {
      req('getProvince', {
      }).then(data => {
        console.log('省接口信息', data)
        this.provinceOptions = data.data
      })
    },
    // 传入value（选中的省编码），获取市信息
    getCity (value) {
      // console.log(value)
      req('getCity', {
        provinceCode: value
      }).then(data => {
        console.log('市接口信息', data)
        this.cityOptions = data.data
      })
    },
    // 传入value（选中的市编码），获取区信息
    getArea (value) {
      req('getArea', {
        cityCode: value
      }).then(data => {
        console.log('区接口信息', data)
        this.areaOptions = data.data
      })
    },
    // 获取要修改的门店信息
    getDriverData () {
      req('getDriverData', {
        userCode: this.getDriverCode[0].userCode
      }).then(data => {
        console.log('要修改的司机信息', data)
        this.dialogFormData = Object.assign({}, data.data)
        this.dialogFormData.phone = parseInt(data.data.phone)
        this.getProvince()
        this.getCity(data.data.provinceCode)
        this.getArea(data.data.cityCode)
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
    // 钩子函数获取上传成功返回的地址
    handleAvatarSuccess (res) {
      this.dialogFormData.photoPath = res.data.url
      // console.log(res)
      // console.log(this.dialogFormData.photoPath)
    },
    reset () {
      this.fetch()
      console.log('重置按钮被点击')
    },
    handleSizeChange (value) {
      this.pageInfo.pageSize = value
      this.search()
      console.log('每页多少条', value)
    },
    handleCurrentChange (value) {
      console.log('当前第几页', value)
      this.pageInfo.pageIndex = value
      this.search()
    },
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getDriverCode = rows
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addDriver') {
            // console.log('表单校验通过了')
            req('addDriver', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.$refs.form.resetFields()
                this.dialogVisible = false
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editDriver') {
            req('editDriver', {
              ...this.dialogFormData,
              userCode: this.getDriverCode[0].userCode,
              version: this.getDriverCode[0].version
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.fetch()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogBeforeClose () {
      // console.log(111)
      this.$refs.form.resetFields()
      this.$refs.upload.clearFiles()
      this.dialogVisible = false
    },
    validateIdCard (rule, value, callback) {
      let rules = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!rules.test(value)) {
        callback(new Error('请输入正确的身份证号！'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.el-form {
  .el-form-item {
    .el-form-item__content {
      .el-select {
        width: 210px;
        margin-right: 4px;
      }

      .el-input {
        // width: 220px;
        .el-input__inner {
          width: 210px;
          border-radius: 0;
          height: 30px;
        }
      }
    }
  }
}
</style>
