<template>
  <div class="i-table">
    <!-- 按钮列表 -->
    <div class="btn-list" v-show="toolbar.length"> <!-- v-show="toolar.length > 0 ? true : false" -->
      <el-button
        v-for="(item, index) in toolbar"
        :key="index"
        :type="item.type"
        @click="item.func">
        {{item.btnName}}
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table border
        stripe
        style="width: 100%"
        v-show="tableData.length"
        :data="tableData"
        align="center"
        max-height="400px"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="selectionShow"
          type="selection"
          align="center"
          fixed="left">
        </el-table-column>
        <slot></slot>
      </el-table>
      <!-- <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div> -->
    </div>
    <div class="table-pagination" v-show="tableData.length">
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
  </div>
</template>

<script>
export default {
  name: 'i-table',
  props: {
    toolbar: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageInfo: {
      type: Object,
      default: () => {
        return {
          pageIndex: 1,
          pageSize: 5,
          total: 0
        }
      }
    },
    selectionShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentPage: 1
    }
  },
  computed: {
  },
  mounted () {
    this.pageInfo.total = this.tableData.length
    // console.log(this.tableData.length)
  },
  methods: {
    // toggleSelection (rows) {
    //   if (rows) {
    //     rows.forEach(row => {
    //       this.$refs.multipleTable.toggleRowSelection(row)
    //     })
    //   } else {
    //     this.$refs.multipleTable.clearSelection()
    //   }
    // },
    // 每页条数
    handleSizeChange (value) {
      this.$emit('handleSizeChange', value)
    },
    // 当前页数
    handleCurrentChange (value) {
      this.$emit('handleCurrentChange', value)
    },
    // 改变多选框
    handleSelectionChange (rows) {
      this.$emit('selection-change', rows)
    }
  }
}
</script>

<style lang='scss' scoped>
.i-table {
  padding: 10px;
  width: 86%;
  height: 370px;
  .btn-list {
    margin-bottom: 10px;
  }
  .el-pagination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
