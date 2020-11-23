<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="状态" prop="state">
        <el-select v-model="formData.state" placeholder="全部">
          <el-option
            v-for="(item, index) in stateOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
          <!-- <el-option label="全部" value="All"></el-option>
          <el-option label="启用" value="start"></el-option>
          <el-option label="禁用" value="disable"></el-option> -->
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
        :show-overflow-tooltip="true"
        :formatter="columnFormatter"
        :width="item.width">
        <template slot-scope="scope">
          <el-button v-if="item.prop === 'chartRoute'" type="text" @click="watchImage(scope.row)">轮播图预览</el-button>
          <span v-else>{{ filterDist(scope.row[item.prop], item) }}</span>
        </template>
        </el-table-column>
    </i-table>

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
          <el-form-item label="排序" prop="serialNumber">
            <el-input v-model.number="dialogFormData.serialNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="有效期起" prop="startDate">
            <el-date-picker type="date" placeholder=" 年 / 月 / 日"
              v-model="dialogFormData.startDate"
              :picker-options="startTimePickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="有效期止" prop="closingDate">
            <el-date-picker type="date" placeholder=" 年 / 月 / 日"
                v-model="dialogFormData.closingDate"
                :picker-options="endTimePickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="选择商品" prop="goodsCode">
            <comm-select class="comm-selects" v-model="dialogFormData.goodsCode"></comm-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
            <el-form-item label="商品图片" prop="chartRoute">
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
import CommSelect from './comm-select.vue'
import req from '@/api/home-pic-manage.js'
import moment from 'moment'

export default {
  name: 'home-pic-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      formData: {
        state: ''
      },
      dialogVisible: false,
      dialogTitle: '新增轮播图',
      dialogFormData: {
        serialNumber: '',
        startDate: '',
        closingDate: '',
        goodsCode: '',
        chartRoute: ''
      },
      chartCode: '',
      version: '',
      photoToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      getSelectHomePicCode: [],
      SelectHomePicCode: '',
      // 存放期望的商品状态
      state: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增轮播图'
            this.dialogVisible = true
            // console.log(this.dialogVisible)
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getSelectHomePicCode.length === 0) {
              this.$message.error('请勾选需要删除的轮播图，可多选！')
            } else if (this.getSelectHomePicCode.length === 1) {
              this.$confirm('此操作将永久删除选中的轮播图，是否继续？').then(() => {
                this.SelectHomePicCode = this.getSelectHomePicCode[0].chartCode
                req('deleteHomePic', {
                  chartCode: this.SelectHomePicCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.fetch()
                    this.$message.success(data.msg)
                  }
                })
              }).catch(() => {})
            } else {
              // 遍历多选的用户，放到userCode里
              for (let i = 0; i < this.getSelectHomePicCode.length; i++) {
                this.SelectHomePicCode = this.getSelectHomePicCode[i].chartCode + ',' + this.SelectHomePicCode
              }
              this.$confirm('此操作将永久删除选中的轮播图，是否继续？').then(() => {
                req('deleteHomePic', {
                  chartCode: this.SelectHomePicCode
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
        },
        {
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.getSelectHomePicCode.length === 0) {
              this.$message.error('请选择一个要启用的轮播图')
            } else if (this.getSelectHomePicCode.length === 1) {
              this.$confirm('是否将第“' + this.getSelectHomePicCode[0].serialNumber + '”个轮播图状态改为启用？').then(() => {
                // console.log('banbenhao', this.getSelectHomePicCode[0].version)
                this.state = '0'
                this.chartCode = this.getSelectHomePicCode[0].chartCode
                this.version = this.getSelectHomePicCode[0].version
                this.editHomePicState()
              }).catch(() => {})
            } else {
              for (let i = 0; i < this.getSelectHomePicCode.length; i++) {
                this.chartCode = this.getSelectHomePicCode[i].chartCode + ',' + this.chartCode
                this.version = this.getSelectHomePicCode[i].version + ',' + this.version
              }
              this.$confirm('是否将选中的“' + this.getSelectHomePicCode.length + '”个轮播图状态改为启用？').then(() => {
                // console.log('banbenhao', this.getSelectHomePicCode[0].version)
                this.state = '0'
                this.editHomePicState()
              }).catch(() => {})
            }
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.getSelectHomePicCode.length === 0) {
              this.$message.error('请选择一个要禁用的轮播图')
            } else if (this.getSelectHomePicCode.length === 1) {
              this.$confirm('是否将第“' + this.getSelectHomePicCode[0].serialNumber + '”个轮播图状态改为禁用？').then(() => {
                // console.log('banbenhao', this.getSelectHomePicCode[0].version)
                this.state = '1'
                this.chartCode = this.getSelectHomePicCode[0].chartCode
                this.version = this.getSelectHomePicCode[0].version
                this.editHomePicState()
              }).catch(() => {})
            } else {
              for (let i = 0; i < this.getSelectHomePicCode.length; i++) {
                this.chartCode = this.getSelectHomePicCode[i].chartCode + ',' + this.chartCode
                this.version = this.getSelectHomePicCode[i].version + ',' + this.version
              }
              this.$confirm('是否将选中的“' + this.getSelectHomePicCode.length + '”个轮播图状态改为禁用？').then(() => {
                // console.log('banbenhao', this.getSelectHomePicCode[0].version)
                this.state = '1'
                this.editHomePicState()
              }).catch(() => {})
            }
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'serialNumber', width: '80px'},
        // {label: '图片路径', prop: 'chartRoute'},
        {label: '状态', prop: 'state', distName: 'stateOptions', width: '100px'},
        {label: '预览', prop: 'chartRoute', width: '180px'},
        {label: '轮播图编号', prop: 'chartCode', width: '250px'},
        {label: '有效期起', prop: 'startDate'},
        {label: '有效期止', prop: 'closingDate'}
      ],
      stateOptions: [
        {label: '全部', value: ''},
        {label: '启用', value: '0'},
        {label: '禁用', value: '1'}
      ],
      tableData: [
      ],
      startTimePickerOptions: {
        disabledDate: (value) => {
          if (this.dialogFormData.closingDate !== '') {
            return this.dialogFormData.closingDate < value
          }
        }
      },
      endTimePickerOptions: {
        disabledDate: (value) => {
          return this.dialogFormData.startDate > value
        }
      },
      multipleSelection: [],
      formRules: {
        serialNumber: [
          { required: true, message: '请输入序号', trigger: 'blur' },
          { type: 'number', message: '序号必须为数字' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择有效期起', trigger: 'change' }
        ],
        closingDate: [
          { type: 'date', required: true, message: '请选择有效期止', trigger: 'change' }
        ],
        goodsCode: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        chartRoute: [
          { required: true, message: '请选择商品图片', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
  },
  computed: {
  },
  methods: {
    // 获取上传成功返回的地址
    handleAvatarSuccess (res) {
      this.dialogFormData.chartRoute = res.data.url
      // console.log('hahah', res)
      // console.log(this.dialogFormData.photoPath)
    },
    // fetch让每次搜索都从第一页开始搜索
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('getHomePicList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    reset () {
      this.fetch()
      console.log('重置按钮被点击')
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
    // 改变轮播图状态
    editHomePicState () {
      req('editHomePicState', {
        state: this.state,
        chartCode: this.chartCode,
        version: this.version
      }).then(data => {
        if (data.code === 0) {
          this.fetch()
          this.chartCode = ''
          this.version = ''
          this.$message.success(data.msg)
        }
      })
    },
    handleSizeChange (value) {
      console.log('每页多少条', value)
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      console.log('当前第几页', value)
      this.pageInfo.pageIndex = value
      this.search()
    },
    handleSelectionChange (rows) {
      console.log('rows', rows)
      this.getSelectHomePicCode = rows
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.upload.clearFiles()
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          req('addHomePic', {
            ...this.dialogFormData,
            startDate: this.dialogFormData.startDate ? moment(this.dialogFormData.startDate).format('YYYY-MM-DD') : '',
            closingDate: this.dialogFormData.closingDate ? moment(this.dialogFormData.closingDate).format('YYYY-MM-DD') : ''
          }).then(data => {
            if (data.code === 0) {
              this.$message.success(data.msg)
              this.dialogVisible = false
              this.$refs.form.resetFields()
              this.$refs.upload.clearFiles()
              this.fetch()
            } else {
              this.$message.error(data.msg)
            }
          })
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
    // 预览图片
    watchImage (data) {
      window.open(data.chartRoute)
    },
    // 转换字典
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        // console.log(row)
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    dateSwitch () {
      this.dialogFormData.startDate = moment(this.dialogFormData.startDate).format('YYYY-MM-DD')
      this.dialogFormData.closingDate = moment(this.dialogFormData.closingDate).format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang='scss' scoped>
// .comm-selects {
//   margin-top: 50px;
// }
</style>
