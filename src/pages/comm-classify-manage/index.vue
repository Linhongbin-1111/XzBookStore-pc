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
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="comm-classify-info">
      <div class="comm-classify-title">分类详情</div>
      <div class="comm-classify-form">
        <el-form ref="detailForm" :model="commClassifyFormData" :inline="true" label-width="100px">
          <el-form-item label="分类名称" prop="sortName">
            <el-input v-model="commClassifyFormData.sortName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="sortRemarks">
            <el-input v-model="commClassifyFormData.sortRemarks" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :showButton="true"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-before-close="dialogBeforeClose">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="25%">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="分类名称" prop="sortName">
              <el-input v-model="dialogFormData.sortName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="备注" prop="sortRemarks">
              <el-input v-model="dialogFormData.sortRemarks" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import req from '@/api/comm-classify-manage.js'
import IDialog from '@/components/common/i-dialog.vue'

export default {
  name: 'comm-classify-manage',
  components: {
    IDialog
  },
  data () {
    return {
      commClassifyFormData: {
        sortCode: '',
        sortName: ''
      },
      dialogVisible: false,
      dialogTitle: '新增商品分类',
      dialogType: '',
      version: '',
      // 存放要修改的分类编号
      sortCode: '',
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.$confirm('如果您想新增二级分类，请选中一个一级分类，再进行新增！').then(() => {
              this.dialogTitle = '新增商品分类'
              this.dialogVisible = true
              this.dialogType = 'addCommClassify'
              this.dialogFormData = {}
              this.dialogFormData.sortParentCode = this.sortParentCode
            }).catch(() => {
            })
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.sortCode === '') {
              this.$message.error('请点击一个需要修改的商品分类！')
            } else {
              this.dialogTitle = '修改商品分类信息'
              this.dialogType = 'editCommClassify'
              this.dialogVisible = true
              // this.getUserData()
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            // 删除用户接口
            if (this.sortCode === '') {
              this.$message.error('请点击需要删除的商品分类，不可多选！')
            } else {
              this.$confirm('此操作将永久删除“' + this.commClassifyFormData.sortName + '”分类，是否继续？').then(() => {
                req('deleteCommClassify', {
                  sortCode: this.sortCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.search()
                    this.$refs.detailForm.resetFields()
                    this.$message.success(data.msg)
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }).catch(() => {
                this.$message.info('已取消')
              })
            }
          }
        },
        {
          btnName: '刷新',
          type: 'primary',
          func: () => {
            this.search()
            this.sortCode = ''
            this.$refs.detailForm.resetFields()
          }
        }
      ],
      data: [
      ],
      defaultProps: {
        children: 'secondSort',
        label: 'label'
      },
      getClickCommClassifyCode: [],
      dialogFormData: {
        sortName: '',
        sortRemarks: '',
        sortParentCode: ''
      },
      // 存放父编号（新增二级分类时）
      sortParentCode: '',
      formRules: {
        sortName: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        sortRemarks: [
          { required: true, message: '备注信息不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      req('getCommClassifyList', {
      }).then(data => {
        console.log('商品分类', data)
        this.data = this.initData(data.data)
        if (data.code === 0) {
          this.$message.success('刷新成功！')
        }
      })
    },
    // 将一二级分类名称转换成label
    initData (data) {
      const treeData = JSON.parse(JSON.stringify(data).replace(/secondSortName|sortName/g, 'label'))
      return treeData
    },
    // 获取分类详情
    handleNodeClick (data) {
      // console.log('data', data)
      this.getClickCommClassifyCode = data
      if (this.getClickCommClassifyCode.sortCode !== undefined) {
        req('getCommClassifyData', {
          sortCode: this.getClickCommClassifyCode.sortCode
        }).then(data => {
          console.log('yiji', data)
          this.commClassifyFormData = Object.assign({}, data.data)
          this.dialogFormData = Object.assign({}, data.data)
          this.sortParentCode = data.data.sortCode
          this.version = data.data.version
          this.sortCode = data.data.sortCode
        })
      } else {
        req('getCommClassifyData', {
          sortCode: this.getClickCommClassifyCode.secondSortCode
        }).then(data => {
          console.log('erji', data)
          this.commClassifyFormData = Object.assign({}, data.data)
          this.dialogFormData = Object.assign({}, data.data)
          this.sortCode = data.data.sortCode
          this.version = data.data.version
        })
      }
    },
    dialogBeforeClose () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
      // 解决用户先使用修改再使用新增时所出现的表单未清空现象
      this.dialogFormData = Object.assign({}, '')
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      // 解决用户先使用修改再使用新增时所出现的表单未清空现象
      this.dialogFormData = Object.assign({}, '')
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addCommClassify') {
            req('addCommClassify', {
              ...this.dialogFormData
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.search()
                this.sortParentCode = ''
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editCommClassify') {
            req('editCommClassify', {
              ...this.dialogFormData,
              version: this.version,
              sortCode: this.sortCode
            }).then(data => {
              // this.dialogFormData = Object.assign({}, data.data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                // 刷新详情显示框
                this.handleNodeClick(data)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.sortCode = ''
                this.search()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false
          }
        }
      })
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
      text-align: center;
      border: 1px solid rgb(228, 228, 228);
      box-sizing: border-box;
      /deep/ .el-tree {
        margin: 20px 30px;
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
          width: 100px;
        }
        .el-form-item__content {
          .el-input__inner {
            width: 80%;
          }
        }
      }
    }
  }
}
</style>
