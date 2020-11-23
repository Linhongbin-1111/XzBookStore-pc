<template>
  <div>
    <i-search ref="iSearch"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="客户名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="客户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
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

    <!-- <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm"
    @dialog-before-close="dialogBeforeClose">
    <el-form :model="dialogFormData"
      label-width="120px"
      ref="form"
      :rules="formRules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="轮播图片" prop="test1">
            <el-input v-model="dialogFormData.test1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="排序" prop="test2">
            <el-input v-model="dialogFormData.test2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="有效期起" prop="test5">
            <el-date-picker type="date" placeholder=" 年 / 月 / 日" v-model="dialogFormData.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="有效期止" prop="test5">
            <el-date-picker type="date" placeholder=" 年 / 月 / 日" v-model="dialogFormData.date1" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品" prop="test11">
          </el-form-item>
          <el-button slot="trigger" size="small" type="primary">选择</el-button>
        </el-col>
      </el-row>
    </el-form>
    </i-dialog> -->
  </div>
</template>

<script>
import ISearch from '@/components/common/i-search.vue'
import ITable from '@/components/common/i-table.vue'
// import IDialog from '@/components/common/i-dialog.vue'
import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    ISearch,
    ITable
    // IDialog
  },
  data () {
    return {
      formData: {
        userName: '',
        userAcct: ''
      },
      dialogVisible: false,
      dialogTitle: '新增轮播图',
      dialogFormData: {},
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [],
      sexList: [
        {label: '男', value: '0'},
        {label: '女', value: '1'}
      ],
      columnList: [
        {label: '客户账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '性别', prop: 'sex', distName: 'sexList'},
        {label: '手机', prop: 'phone'},
        {label: '客户邮箱', prop: 'email', width: '180px'},
        {label: '身份证', prop: 'idCard', width: '220px'}
      ],
      tableData: [
      ],
      multipleSelection: []
      // formRules: {
      //   test1: [
      //     { required: true, message: '请输入司机姓名', trigger: 'blur' },
      //     { min: 2, max: 4, message: '长度在 2 到 4 个字符', trigger: 'blur' }
      //   ],
      //   test2: [
      //     { required: true, message: '请输入联系电话', trigger: 'change' },
      //     { type: 'number', message: '手机号码必须为数字' }
      //   ],
      //   test3: [
      //     { required: true, message: '请输入司机账号', trigger: 'change' },
      //     { type: 'number', message: '司机账号必须为数字' }
      //   ],
      //   test4: [
      //     { type: 'number', required: true, message: '请输入密码' }
      //   ],
      //   test5: [
      //     { type: 'number', required: true, message: '请输入身份证号码', trigger: 'change' }
      //   ],
      //   test6: [
      //     { required: true, message: '请选择省份', trigger: 'change' }
      //   ],
      //   test7: [
      //     { required: true, message: '请选择城市', trigger: 'change' }
      //   ],
      //   test8: [
      //     { required: true, message: '请选择地区', trigger: 'change' }
      //   ],
      //   test9: [
      //     { required: true, message: '请选择省份', trigger: 'change' }
      //   ],
      //   test10: [
      //     { required: true, message: '请选择城市', trigger: 'change' }
      //   ],
      //   test11: [
      //     { required: true, message: '请选择地区', trigger: 'change' }
      //   ]
      // }
    }
  },
  mounted () {
    // this.pageInfo.total = this.tableData.length
    this.fetch() // 实时从接口获取最新的用户列表
  },
  computed: {
  },
  methods: {
    // fetch让每次搜索都从第一页开始搜索
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    search () {
      req('getClientList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    reset () {
      this.fetch()
      // console.log('重置按钮被点击')
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
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
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
      console.log(111)
      this.$refs.form.resetFields()
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
</style>
