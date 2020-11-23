<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsCode">
        <el-input v-model="formData.goodsCode"></el-input>
      </el-form-item>
    </i-search>
    <i-table :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      fit
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :width="item.width"
        :prop="item.prop"
        align="center"
        :show-overflow-tooltip="true">
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
          <el-form-item label="热门位排序" prop="serialNumber">
            <el-input v-model.number="dialogFormData.serialNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品" prop="goodsCode">
            <comm-select v-model="dialogFormData.goodsCode"></comm-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog>
    <i-dialog v-model="showNumberDialogVisible"
    :title="dialogTitle"
    :showButton="true"
    width="200px"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeClose">
    <el-form :model="showNumberDialogFormData"
      label-width="120px"
      ref="form"
      :rules="formRules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="展示数量" prop="fieldValue">
            <el-input v-model.number="showNumberDialogFormData.fieldValue"></el-input>
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
import req from '@/api/hot-comm-manage.js'
import CommSelect from './comm-select.vue'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      getHotCommCode: [],
      hotCommCode: '',
      hotCommVersion: '',
      showNumberVersion: '',
      formData: {
        goodsCode: '',
        goodsName: ''
      },
      dialogVisible: false,
      dialogTitle: '新增热门位商品',
      dialogFormData: {
        serialNumber: '',
        goodsCode: ''
        // goodsName: '',
        // goodsPrice: '',
        // goodsIntroduce: '',
        // hotgoodsCode: '',
        // version: ''
      },
      showNumberDialogFormData: {
        fieldValue: ''
      },
      showNumberDialogVisible: false,
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
            this.dialogTitle = '新增热门商品'
            this.dialogType = 'addHotComm'
            this.dialogVisible = true
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getHotCommCode.length === 0) {
              this.$message.error('请勾选一个需要修改的热门商品！')
            } else if (this.getHotCommCode.length === 1) {
              this.dialogVisible = true
              this.dialogTitle = '修改热门位商品信息'
              this.dialogType = 'editHotComm'
              this.hotCommCode = this.getHotCommCode[0].hotGoodsCode
              this.getHotCommData()
            } else {
              this.$message.error('一次只能勾选一个需要修改的热门商品！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getHotCommCode.length === 0) {
              this.$message.error('请勾选需要删除的热门商品，可多选！')
            } else if (this.getHotCommCode.length === 1) {
              this.hotCommCode = this.getHotCommCode[0].hotGoodsCode
              this.$confirm('此操作将永久删除该热门商品，是否继续？').then(() => {
                req('deleteHotComm', {
                  hotGoodsCode: this.hotCommCode
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
              for (let i = 0; i < this.getHotCommCode.length; i++) {
                this.hotCommCode = this.getHotCommCode[i].hotGoodsCode + ',' + this.hotCommCode
              }
              // console.log(this.hotCommCode)
              this.$confirm('此操作将永久删除该热门商品，是否继续？').then(() => {
                req('deleteHotComm', {
                  hotGoodsCode: this.hotCommCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.fetch()
                    this.$message.success(data.msg)
                  }
                })
              }).catch(() => {})
            }
          }
        },
        {
          btnName: '展示数量设置',
          type: 'primary',
          func: () => {
            this.showNumberDialogVisible = true
            this.dialogTitle = '设置展示数量'
            this.dialogType = 'editHotCommShowNumber'
            this.getHotCommShowNumber()
          }
        }
      ],
      columnList: [
        {label: '排序', prop: 'serialNumber', width: '80px'},
        {label: '商品编号', prop: 'goodsCode', width: '220px'},
        {label: '商品名称', prop: 'goodsName', width: '200px'},
        {label: '商品价格', prop: 'goodsPrice', width: '100px'},
        {label: '商品介绍', prop: 'goodsIntroduce', width: '450px'}
      ],
      tableData: [
      ],
      multipleSelection: [],
      formRules: {
        goodsCode: [
          { required: true, message: '请选择显示于热门位的商品', trigger: 'blur' }
        ],
        serialNumber: [
          { required: true, message: '请输入热门位商品顺序', trigger: 'blur' },
          { type: 'number', message: '顺序必须为数字' }
        ],
        fieldValue: [
          { required: true, message: '请输入展示数量', trigger: 'blur' },
          { type: 'number', message: '展示数量必须为数字' }
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
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    // 获取热门商品列表
    search () {
      req('getHotCommList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log('hah', data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 修改热门商品信息前，获取用户信息显示到dialog
    getHotCommData () {
      req('getHotCommData', {
        hotGoodsCode: this.hotCommCode
      }).then(data => {
        this.hotCommVersion = data.data.version
        // console.log('getHot', data)
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    // 修改热门位展示数量前，获取展示数量信息
    getHotCommShowNumber () {
      req('getHotCommShowNumber', {
      }).then(data => {
        this.showNumberVersion = data.data.version
        console.log('haha', this.showNumberVersion)
        this.showNumberDialogFormData.fieldValue = parseInt(data.data.fieldValue)
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
      this.getHotCommCode = rows
      console.log('rows', rows)
    },
    dialogCancel () {
      this.dialogVisible = false
      this.showNumberDialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addHotComm') {
            req('addHotComm', {
              ...this.dialogFormData
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
          } else if (this.dialogType === 'editHotComm') {
            req('editHotComm', {
              ...this.dialogFormData,
              hotGoodsCode: this.hotCommCode
              // version: this.hotCommVersion
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            }) // 修改展示数量确认按钮
          } else if (this.dialogType === 'editHotCommShowNumber') {
            req('editHotCommShowNumber', {
              fieldValue: this.showNumberDialogFormData.fieldValue,
              version: this.showNumberVersion
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.showNumberDialogVisible = false
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
      this.showNumberDialogVisible = false
      this.$refs.form.resetFields()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
