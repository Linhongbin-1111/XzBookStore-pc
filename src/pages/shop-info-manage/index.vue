<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="门店编号" prop="storeCode">
        <el-input v-model="formData.storeCode"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="formData.storeName"></el-input>
      </el-form-item>
      <el-form-item label="店长名称" prop="managerName">
        <el-input v-model="formData.managerName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provinceCode">
        <el-select v-model="formData.provinceCode"
          placeholder="请选择"
          @focus="getProvince"
          @change="getCity(formData.provinceCode)">
          <el-option v-for="(item, index) in provinceOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityCode">
        <el-select v-model="formData.cityCode"
          placeholder="请选择"
          @change="getArea(formData.cityCode)">
          <el-option v-for="(item, index) in cityOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaCode">
        <el-select v-model="formData.areaCode" placeholder="请选择">
          <el-option v-for="(item, index) in areaOptions"
            :key="index"
            :label="item.label"
            :value="item.value"></el-option>
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
        align="center"
        :width="item.width">
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
          <el-form-item label="门店名称" prop="storeName">
            <el-input v-model="dialogFormData.storeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话" prop="storePhone">
            <el-input v-model.number="dialogFormData.storePhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="店长编号" prop="managerCode">
            <el-input v-model="dialogFormData.managerCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="营业执照编码" prop="businessLine">
            <el-input v-model="dialogFormData.businessLine"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在省份" prop="provinceCode">
            <el-select v-model="dialogFormData.provinceCode"
              placeholder="请选择"
              @change="getCity(dialogFormData.provinceCode)">
              <el-option v-for="(item, index) in dialogProvinceOptions"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在城市" prop="cityCode">
            <el-select v-model="dialogFormData.cityCode"
              placeholder="请选择"
              @change="getArea(dialogFormData.cityCode)">
              <el-option v-for="(item, index) in dialogCityOptions"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="所在区" prop="areaCode">
            <el-select v-model="dialogFormData.areaCode"
              placeholder="请选择">
              <el-option v-for="(item, index) in dialogAreaOptions"
                :key="index"
                :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="详细地址" prop="storeAddress">
            <el-input type="textarea" v-model="dialogFormData.storeAddress"></el-input>
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
import req from '@/api/shop-info-manage.js'

export default {
  name: 'shop-info-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        storeCode: '',
        storeName: '',
        managerName: '',
        provinceCode: '',
        cityCode: '',
        areaCode: ''
      },
      isShow: false,
      dialogVisible: false,
      dialogTitle: '新增门店',
      dialogType: '',
      dialogFormData: {
        storeName: '',
        storePhone: '',
        managerCode: '',
        businessLine: '',
        provinceCode: '',
        cityCode: '',
        areaCode: '',
        storeAddress: ''
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      provinceOptions: [],
      dialogProvinceOptions: [],
      cityOptions: [],
      dialogCityOptions: [],
      areaOptions: [],
      dialogAreaOptions: [],
      storeCode: '',
      getStoreCode: [],
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            console.log(this)
          }
        },
        {
          // // 控制店长权限
          // isable: this.isShow,
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogTitle = '新增门店信息'
            this.dialogType = 'addStore'
            // console.log(this.isShow)
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getStoreCode.length === 0) {
              this.$message.error('请勾选一个需要修改的门店！')
            } else if (this.getStoreCode.length === 1) {
              this.dialogType = 'editStore'
              this.dialogTitle = '修改门店信息'
              this.dialogVisible = true
              this.getStoreData()
            } else {
              this.$message.error('一次只能修改一个门店信息！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getStoreCode.length === 0) {
              this.$message.error('请勾选需要删除的门店，可多选！')
            } else if (this.getStoreCode.length === 1) {
              this.$confirm('此操作将永久删除“' + this.getStoreCode[0].storeName + '”，是否继续？').then(() => {
                req('deleteStore', {
                  storeCode: this.getStoreCode[0].storeCode
                }).then(data => {
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  }
                })
              }).catch(() => {})
            } else {
              for (let i = 0; i < this.getStoreCode.length; i++) {
                this.storeCode = this.getStoreCode[i].storeCode + ',' + this.storeCode
              }
              this.$confirm('此操作将永久删除选中的“' + this.getStoreCode.length + '”个门店，是否继续？').then(() => {
                req('deleteStore', {
                  storeCode: this.storeCode
                }).then(data => {
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
        {label: '门店编号', prop: 'storeCode', width: '200px'},
        {label: '门店名称', prop: 'storeName'},
        {label: '电话', prop: 'storePhone'},
        {label: '详细地址', prop: 'storeAddress', width: '200px'},
        {label: '店长姓名', prop: 'managerName'},
        {label: '邀请码', prop: 'storeInvite'},
        {label: '门店账号', prop: 'storeAcct', width: '200px'}
      ],
      tableData: [
      ],
      multipleSelection: [],
      formRules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
          // { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
        ],
        storePhone: [
          { required: true, message: '请输入联系电话', trigger: 'bulr' },
          { type: 'number', message: '手机号码必须为数字' }
        ],
        managerCode: [
          { required: true, message: '请输入店长编号', trigger: 'blur' }
        ],
        businessLine: [
          { required: true, message: '请输入营业执照编码', trigger: 'blur' }
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
        storeAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
    this.showButton()
    this.getProvince()
    // this.getProvince()
    // this.getCity()
    // this.getArea()
  },
  // 从首页获取role角色
  computed: {
  },
  methods: {
    // 通过角色显示按钮
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
    // 获取门店信息列表
    search () {
      this.role = this.getRole
      req('listStore', {
        ...this.formData,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log('门店信息', data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 获取省信息
    getProvince (value) {
      req('getProvince', {
      }).then(data => {
        console.log('省接口信息', data)
        this.provinceOptions = data.data.map(item => {
          return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
        })
        this.dialogProvinceOptions = data.data.map(item => {
          return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
        })
      })
    },
    // 传入value（选中的省编码），获取市信息
    getCity (value) {
      if (!value) {
        this.formData.cityCode = ''
        this.formData.areaCode = ''
        this.cityOptions = []
        this.areaOptions = []
        return
      }
      return new Promise((resolve, reject) => {
        if (this.dialogVisible) {
          this.dialogFormData.cityCode = ''
          this.dialogFormData.areaCode = ''
          this.dialogCityOptions = []
          this.dialogAreaOptions = []
          req('getCity', {
            provinceCode: value
          }).then(data => {
            console.log('市接口信息', data)
            this.dialogCityOptions = data.data.map(item => {
              return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
            })
            resolve(this.dialogCityOptions)
          })
        } else {
          this.formData.cityCode = ''
          this.formData.areaCode = ''
          this.cityOptions = []
          this.areaOptions = []
          req('getCity', {
            provinceCode: value
          }).then(data => {
            console.log('市接口信息', data)
            this.cityOptions = data.data.map(item => {
              return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
            })
            resolve(this.cityOptions)
          })
        }
      })
    },
    // 传入value（选中的市编码），获取区信息
    getArea (value) {
      if (!value) {
        this.formData.areaCode = ''
        this.areaOptions = []
        return
      }
      return new Promise((resolve, reject) => {
        if (this.dialogVisible) {
          this.dialogFormData.areaCode = ''
          this.dialogAraeOptions = []
          req('getArea', {
            cityCode: value
          }).then(data => {
            console.log('区接口信息', data)
            this.dialogAreaOptions = data.data.map(item => {
              return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
            })
            resolve(this.dialogAreaOptions)
          })
        } else {
          this.formData.areaCode = ''
          this.areaOptions = []
          req('getArea', {
            cityCode: value
          }).then(data => {
            console.log('区接口信息', data)
            this.areaOptions = data.data.map(item => {
              return Object.assign({}, data.data, {label: item.fieldValue, value: item.fieldCode})
            })
            resolve(this.areaOptions)
          })
        }
      })
    },
    // 获取要修改的门店信息
    getStoreData () {
      req('getStoreByStoreCode', {
        storeCode: this.getStoreCode[0].storeCode
      }).then(data => {
        console.log('要修改的门店信息', data)
        Promise.all([
          this.getCity(data.data.provinceCode),
          this.getArea(data.data.cityCode)
        ]).then(dataList => {
          this.dialogFormData = Object.assign({}, data.data)
          this.dialogFormData.storePhone = parseInt(data.data.storePhone)
        })
      })
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
      // console.log('rows', rows)
      this.getStoreCode = rows
    },
    dialogCancel () {
      this.dialogVisible = false
      this.cityOptions = []
      this.areaOptions = []
      this.dialogCityOptions = []
      this.dialogAreaOptions = []
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addStore') {
            // console.log('表单校验通过了')
            req('addStore', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.cityOptions = []
                this.areaOptions = []
                this.dialogCityOptions = []
                this.dialogAreaOptions = []
                this.$refs.form.resetFields()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editStore') {
            req('editStore', {
              ...this.dialogFormData,
              storeCode: this.getStoreCode[0].storeCode,
              version: this.getStoreCode[0].version
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                // 清空现存的选项
                this.cityOptions = []
                this.areaOptions = []
                this.dialogCityOptions = []
                this.dialogAreaOptions = []
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
      this.cityOptions = []
      this.areaOptions = []
      this.dialogCityOptions = []
      this.dialogAreaOptions = []
      this.$refs.form.resetFields()
      this.dialogVisible = false
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
