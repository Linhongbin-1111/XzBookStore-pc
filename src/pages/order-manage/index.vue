<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="下单人" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="订单编码" prop="orderCode">
        <el-input v-model="formData.orderCode"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderState">
        <el-select v-model="formData.orderState" placeholder="全部">
          <el-option
            v-for="(item, index) in orderStateIdOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
          <!-- <el-option label="全部" value="All"></el-option>
          <el-option label="已下单" value="start"></el-option>
          <el-option label="已发货" value="fahuo"></el-option>
          <el-option label="已完成未评价" value="weipingjia"></el-option>
          <el-option label="已完成已评价" value="yipingjia"></el-option>
          <el-option label="已取消" value="cancel"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="付款时间" prop="payTimeStart">
        <el-date-picker type="date" placeholder=" 年 / 月 / 日"
          v-model="formData.payTimeStart"
          style="width: 100%;"
          :picker-options="startTimePickerOptions"></el-date-picker>
      </el-form-item>
      <span class="line">至</span>
      <el-form-item prop="payTimeEnd" class="special-label">
        <el-date-picker type="date" placeholder=" 年 / 月 / 日"
          v-model="formData.payTimeEnd"
          style="width: 100%;"
          :picker-options="endTimePickerOptions"></el-date-picker>
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
        :width="item.width"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>
    <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    :showButton="false"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeClose">
      <el-table
        :data="dialogTableData"
        :pageInfo="pageInfo"
        :selectionShow="false"
        style="width: 100%"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-for="(item, index) in dialogColumnList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center">
        </el-table-column>
      </el-table>
      <div class="table-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageIndex"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total">
        </el-pagination>
      </div>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/order-manage.js'
import moment from 'moment'

export default {
  name: 'order-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        userName: '',
        phone: '',
        orderCode: '',
        orderState: '',
        payTimeStart: '',
        payTimeEnd: ''
      },
      getOrderCode: [],
      // 存放多个订单编号
      orderCode: '',
      // 存放多个版本号
      version: '',
      orderState: '',
      dialogVisible: false,
      dialogTitle: '订单详情',
      dialogFormData: {},
      orderStateIdOptions: [
        {label: '全部', value: ''},
        {label: '已下单', value: '0'},
        {label: '已取消', value: '1'},
        {label: '已到货', value: '2'},
        {label: '已取货', value: '3'},
        {label: '已完成未评价', value: '4'},
        {label: '已完成已评价', value: '5'}
      ],
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      startTimePickerOptions: {
        disabledDate: (value) => {
          if (this.formData.payTimeEnd !== '') {
            return this.formData.payTimeEnd < value
          }
        }
      },
      endTimePickerOptions: {
        disabledDate: (value) => {
          return this.formData.payTimeStart > value
        }
      },
      toolbar: [
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.getOrderCode.length === 0) {
              this.$message.error('请勾选一个需要显示详情的订单！')
            } else if (this.getOrderCode.length === 1) {
              // this.dialogType = 'editStore'
              this.dialogTitle = '订单详情'
              this.dialogVisible = true
              this.getOrderData()
            }
            // console.log(this.dialogVisible)
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            this.orderState = '1'
            this.editOrderState()
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            this.orderState = '2'
            this.editOrderState()
          }
        },
        {
          btnName: '取消到货',
          type: 'primary',
          func: () => {
            this.orderState = '0'
            this.editOrderState()
          }
        },
        {
          btnName: '订单已取货',
          type: 'primary',
          func: () => {
            this.orderState = '3'
            this.editOrderState()
          }
        },
        {
          btnName: '取消已取货',
          type: 'primary',
          func: () => {
            this.orderState = '2'
            this.editOrderState()
          }
        },
        {
          btnName: '导出',
          type: 'primary',
          func: () => {
            console.log(this)
          }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderCode', width: '200px'},
        {label: '订单总价', prop: 'orderAmout'},
        {label: '订单状态', prop: 'orderState', distName: 'orderStateIdOptions', width: '150px'},
        {label: '门店编码', prop: 'storeCode', width: '200px'},
        {label: '下单人姓名', prop: 'userName', width: '150px'},
        {label: '下单人手机号', prop: 'phone', width: '150px'},
        {label: '确认付款时间', prop: 'payTime', width: '200px'}
      ],
      dialogColumnList: [
        {label: '用户id', prop: 'userCode'},
        {label: '订单编码', prop: 'orderCode'},
        {label: '商品编码', prop: 'goodsCode'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '购买数量', prop: 'buyNumber'},
        {label: '总金额', prop: 'totalSum'},
        {label: '售价', prop: 'goodsPrice'},
        {label: '定价', prop: 'goodsShelfSost'}
      ],
      tableData: [
      ],
      dialogTableData: [
      ],
      multipleSelection: []
    }
  },
  mounted () {
    this.fetch()
  },
  computed: {
    getRole () {
      return JSON.parse(sessionStorage.getItem('roleInfo')).role
    }
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('getOrderList', {
        ...this.formData,
        payTimeStart: this.formData.payTimeStart ? moment(this.formData.payTimeStart).format('YYYY-MM-DD') : '',
        payTimeEnd: this.formData.payTimeEnd ? moment(this.formData.payTimeEnd).format('YYYY-MM-DD') : '',
        role: this.getRole,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log('订单列表', data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    getOrderData () {
      // console.log(this.getOrderCode[0].orderCode)
      req('getOrderData', {
        orderCode: this.getOrderCode[0].orderCode
      }).then(data => {
        console.log('hahahhaha', data)
        this.dialogTableData = data.data
        // this.pageInfo.pageIndex = data.data.pageNum
        // this.pageInfo.pageSize = data.data.pageSize
        // this.pageInfo.total = data.data.total
      })
    },
    editOrderState () {
      if (this.getOrderCode.length === 0) {
        this.$message.info('请至少选择一个订单，可多选！')
      } else if (this.getOrderCode.length === 1) {
        req('editOrderState', {
          orderCode: this.getOrderCode[0].orderCode,
          version: this.getOrderCode[0].version,
          orderState: this.orderState
        }).then(data => {
          if (data.code === 0) {
            this.$message.success(data.msg)
            this.fetch()
            this.orderState = ''
          } else {
            this.$message.error(data.msg)
            this.orderState = ''
          }
        })
      } else {
        for (let i = 0; i < this.getOrderCode.length; i++) {
          this.orderCode = this.getOrderCode[i].orderCode + ',' + this.orderCode
          this.version = this.getOrderCode[i].version + ',' + this.version
        }
        console.log(this.orderCode)
        req('editOrderState', {
          orderCode: this.orderCode,
          version: this.version,
          orderState: this.orderState
        }).then(data => {
          if (data.code === 0) {
            this.$message.success(data.msg)
            this.orderState = ''
            this.version = ''
            this.orderCode = ''
            this.fetch()
          } else {
            this.$message.error(data.msg)
            this.orderState = ''
            this.version = ''
            this.orderCode = ''
          }
        })
      }
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
      this.getOrderCode = rows
    },
    dialogCancel () {
      this.dialogVisible = false
      // this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('表单校验通过了')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogBeforeClose () {
      // console.log(111)
      // this.$refs.form.resetFields()
      this.dialogVisible = false
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
    }
  }
}
</script>
<style lang='scss' scoped>
.table-pagination {
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
// .i-search {
//   .el-form.el-form--inline{
//     .el-form-item:last-child {
//       .el-form-item__label {
//         width: 200px !important;
//         padding: 0;
//         margin-left: -50px;
//       }
//     }
//   }
// }
.line {
  height: 40px;
  line-height: 40px;
  margin-right: 35px;
  margin-left: 25px;
}
.el-form {
  .el-form-item {
    .el-form-item__content {
      .el-select {
        width: 210px;
        margin-right: 4px;
      }
    }
  }
}

</style>
