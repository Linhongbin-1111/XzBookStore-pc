<template>
  <div>
    <i-search ref="iSearch"
      style="width: 90%;"
      :model="formData"
      @search="fetch"
      @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="state">
        <el-select v-model="formData.state" placeholder="全部">
          <el-option
          v-for="(item, index) in stateOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告词" prop="goodsAdvert">
        <el-input v-model="formData.goodsAdvert"></el-input>
      </el-form-item>
      <el-form-item label="出版社" prop="press">
        <el-input v-model="formData.press"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author"></el-input>
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
        align="center"
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
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
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="dialogFormData.goodsName" placeholder="请输入商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="书号" prop="bookNumber">
            <el-input v-model="dialogFormData.bookNumber" placeholder="请输入书号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <!-- v-model绑分类名，但是传过去后台传的是编号 -->
          <el-form-item label="一级分类" prop="firstSortName">
            <el-select v-model="dialogFormData.firstSortName"
              @focus="getFirstSortCode"
              placeholder="请选择" width="206px"
              @change="getSecondSortCode(dialogFormData.firstSortName)">
              <el-option v-for="(item, index) in firstSortOptions"
                :key="index"
                :label="item.sortName"
                :value="`${item.sortName}|${item.sortCode}`">
              </el-option>
              <!-- <el-option label="传记" value=biography></el-option>
              <el-option label="历史" value="history"></el-option>
              <el-option label="教育" value="education"></el-option>
              <el-option label="文学" value="literature"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="二级分类" prop="secondSortName">
            <el-select v-model="dialogFormData.secondSortName"
              placeholder="请选择" width="206px"
              @change="getSecondSortName(dialogFormData.secondSortName)">
              <el-option v-for="(item, index) in secondSortOptions"
                :key="index"
                :label="item.sortName"
                :value="`${item.sortName}|${item.sortCode}`">
              </el-option>
              <!-- <el-option label="传记" value="biography"></el-option>
              <el-option label="历史" value="history"></el-option>
              <el-option label="教育" value="education"></el-option>
              <el-option label="文学" value="literature"></el-option> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="作者" prop="author">
            <el-input v-model="dialogFormData.author" placeholder="请输入书籍作者"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="出版社" prop="press">
            <el-input v-model="dialogFormData.press" placeholder="请输入出版社"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="广告词" prop="goodsAdvert">
            <el-input type="textarea" v-model="dialogFormData.goodsAdvert" placeholder="请输入广告词"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商品介绍" prop="goodsIntroduce">
            <el-input type="textarea" v-model="dialogFormData.goodsIntroduce" placeholder="请输入商品介绍"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="商家名称" prop="businessName">
            <el-input v-model="dialogFormData.businessName" placeholder="请输入商家名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="库存" prop="stock">
            <el-input v-model.number="dialogFormData.stock" placeholder="请输入库存"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="定价" prop="goodsCost">
            <el-input v-model.number="dialogFormData.goodsCost" placeholder="请输入成本价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="在售价" prop="goodsPrice">
            <el-input v-model.number="dialogFormData.goodsPrice" placeholder="请输入在售价"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="11" v-show="this.dialogType === 'editComm'">
          <el-form-item label="商品状态" prop="state">
            <el-select v-model="dialogFormData.state" placeholder="">
              <el-option
              v-for="(item, index) in dialogStateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="11">
          <el-form-item label="商品图片" prop="photoPath">
            <!-- name是接口请求的字段名 -->
            <el-upload
              v-model="dialogFormData.photoPath"
              ref="upload"
              class="upload-demo"
              action="http://300217906n.picp.vip/pc/uploadImage"
              :limit="1"
              name="file"
              :data="photoToken"
              :on-success="handleAvatarSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
              <!-- <div class="photopath">{{photoPath}}</div> -->
              <div slot="tip" class="el-upload__tip">只能上传1张图片，且不超过5MB</div>
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
import req from '@/api/comm-manage.js'

export default {
  name: 'comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog
  },
  data () {
    return {
      formData: {
        goodsName: '',
        state: '',
        goodsAdvert: '',
        press: '',
        author: ''
      },
      stateOptions: [
        {label: '全部', value: ''},
        {label: '在售', value: '1'},
        {label: '售罄', value: '0'},
        {label: '已下架', value: '2'},
        {label: '未发布', value: '3'}
      ],
      dialogStateOptions: [
        {label: '在售', value: '1'},
        {label: '售罄', value: '0'},
        {label: '已下架', value: '2'},
        {label: '未发布', value: '3'}
      ],
      firstSortOptions: [
      ],
      secondSortOptions: [
      ],
      commCode: '',
      commVersion: '',
      getSelectCommCode: [],
      // 存放点击的以及分类编号
      clickSortCode: '',
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      dialogFormData: {
        goodsName: '',
        bookNumber: '',
        photoPath: '',
        firstSortCode: '',
        firstSortName: '',
        secondSortCode: '',
        secondSortName: '',
        state: '',
        goodsIntroduce: '',
        businessName: '',
        stock: '',
        goodsShelfSost: '',
        goodsCost: '',
        goodsPrice: '',
        goodsAdvert: '',
        author: '',
        press: '',
        volume: 1,
        salesVolume: '',
        browseVolume: ''
      },
      photoToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
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
            this.dialogVisible = true
            this.dialogTitle = '新增商品'
            this.dialogType = 'addComm'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.error('请勾选一个需要修改的商品！')
            } else if (this.getSelectCommCode.length === 1) {
              this.dialogTitle = '修改商品信息'
              this.dialogType = 'editComm'
              this.dialogVisible = true
              this.commCode = this.getSelectCommCode[0].goodsCode
              this.commVersion = this.getSelectCommCode[0].version
              // console.log(this.commCode)
              // console.log(this.commVersion)
              this.getCommData()
            } else {
              this.$message.error('一次只能勾选一个需要修改的商品！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.error('请勾选需要删除的商品，可多选！')
            } else if (this.getSelectCommCode.length === 1) {
              this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                this.commCode = this.getSelectCommCode[0].goodsCode
                req('deleteComm', {
                  goodsCode: this.commCode
                }).then(data => {
                  if (data.code === 0) {
                    this.fetch()
                    this.$message.success(data.msg)
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }).catch(() => {
              })
            } else {
              for (let i = 0; i < this.getSelectCommCode.length; i++) {
                this.commCode = this.getSelectCommCode[i].goodsCode + ',' + this.commCode
              }
              this.$confirm('此操作将永久删除选中的商品，是否继续？').then(() => {
                req('deleteComm', {
                  goodsCode: this.commCode
                }).then(data => {
                  // 传给服务器的数据
                  if (data.code === 0) {
                    this.search()
                    this.$message.success(data.msg)
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }).catch(() => {
              })
            }
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.info('请至少选择一个商品，可多选')
            } else if (this.getSelectCommCode.length === 1) {
              this.$confirm('按确定按钮，将选中的商品上架').then(() => {
                this.commCode = this.getSelectCommCode[0].goodsCode
                this.commVersion = this.getSelectCommCode[0].version
                this.editCommState(this.commCode, '1', this.commVersion, '商品上架成功')
              }).catch(() => {})
            } else {
              this.$confirm('按确定按钮，将选中的“' + this.getSelectCommCode.length + '”个商品上架').then(() => {
                for (let i = 0; i < this.getSelectCommCode.length; i++) {
                  this.commCode = this.getSelectCommCode[i].goodsCode + ',' + this.commCode
                  this.commVersion = this.getSelectCommCode[i].version + ',' + this.commVersion
                }
                this.editCommState(this.commCode, '1', this.commVersion, '商品上架成功')
              }).catch(() => {})
            }
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.info('请至少选择一个商品，可多选')
            } else if (this.getSelectCommCode.length === 1) {
              this.$confirm('按确定按钮，将选中的商品下架').then(() => {
                this.commCode = this.getSelectCommCode[0].goodsCode
                this.commVersion = this.getSelectCommCode[0].version
                this.editCommState(this.commCode, '2', this.commVersion, '商品下架成功')
              }).catch(() => {})
            } else {
              this.$confirm('按确定按钮，将选中的“' + this.getSelectCommCode.length + '”个商品下架').then(() => {
                for (let i = 0; i < this.getSelectCommCode.length; i++) {
                  this.commCode = this.getSelectCommCode[i].goodsCode + ',' + this.commCode
                  this.commVersion = this.getSelectCommCode[i].version + ',' + this.commVersion
                }
                this.editCommState(this.commCode, '2', this.commVersion, '商品下架成功')
              }).catch(() => {})
            }
          }
        }
      ],
      columnList: [
        // {label: '商品编号', prop: 'goodsCode', width: '200px'},
        {label: '商品名称', prop: 'goodsName', width: '150px'},
        {label: '商品状态', prop: 'state', distName: 'stateOptions', width: '130px'},
        {label: '作者', prop: 'author', width: '150px'},
        {label: '出版社', prop: 'press', width: '150px'},
        {label: '定价', prop: 'goodsShelfSost', width: '100px'},
        {label: '售价', prop: 'goodsPrice', width: '100px'},
        {label: '销售量', prop: 'salesVolume', width: '100px'},
        {label: '一级分类', prop: 'firstSortName', width: '130px'},
        {label: '二级分类', prop: 'secondSortName', width: '130px'},
        {label: '上架时间', prop: 'shelfTime', width: '200px'},
        {label: '商品图片路径', prop: 'photoPath', width: '300px'},
        // {label: '上架时间', prop: 'goodsShelfTime'},
        // {label: '浏览量', prop: 'goodsViewsNum'},
        // {label: '商家编码', prop: 'supplierName'},
        {label: '商家名称', prop: 'businessName', width: '120px'},
        {label: '库存', prop: 'stock', width: '100px'},
        {label: 'isbn书号', prop: 'bookNumber', width: '200px'},
        {label: '广告词', prop: 'goodsAdvert', width: '400px'},
        {label: '商品介绍', prop: 'goodsIntroduce', width: '400px'}
      ],
      tableData: [
      ],
      multipleSelection: [],
      formRules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        bookNumber: [
          { required: true, message: '请输入书号', trigger: 'blur' }
          // { min: 5, max: 6, message: '长度在 5 到 6 个字符', trigger: 'blur' }
        ],
        firstSortName: [
          { required: true, message: '请选择一级分类', trigger: 'change' }
        ],
        secondSortName: [
          { required: true, message: '请选择二级分类', trigger: 'change' }
        ],
        author: [
          { required: true, message: '请填写书籍作者', trigger: 'blur' }
        ],
        press: [
          { required: true, message: '请填写出版社', trigger: 'blur' }
        ],
        goodsAdvert: [
          { required: true, message: '请填写广告词', trigger: 'blur' }
        ],
        goodsIntroduce: [
          { required: true, message: '请填写商品介绍', trigger: 'blur' }
        ],
        businessName: [
          { required: true, message: '请输入商家名称', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { type: 'number', message: '库存必须为数字' }
        ],
        goodsCost: [
          { required: true, message: '请输入定价', trigger: 'blur' },
          { type: 'number', message: '定价必须为数字' }
        ],
        goodsPrice: [
          { required: true, message: '请输入在售价', trigger: 'blur' },
          { type: 'number', message: '在售价必须为数字' }
        ],
        photoPath: [
          { required: true, message: '请选择商品图片', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择在售状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.fetch()
    // this.getFirstSortCode()
  },
  computed: {
    photoPath () {
      return this.dialogFormData.photoPath
    }
  },
  created () {
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageIndex = 1
      this.search()
    },
    // 获取商品列表数据
    search () {
      // 服务器请求的数据
      req('getCommList', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex
      }).then(data => {
        // 获取服务器响应的数据
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        console.log(data)
      })
    },
    // 上传图片接口
    uploadImage () {
      req('uploadImage', {
        // 服务器请求的数据
        file: this.file
      }).then(data => {
        // this.dialogFormData.photoPath = data.data.photoPath
        // console.log(data)
      })
    },
    // el-upload自带钩子函数，或许服务器返回的图片地址
    handleAvatarSuccess (res) {
      this.dialogFormData.photoPath = res.data.url
      // console.log(res)
      // console.log(this.dialogFormData.photoPath)
    },
    // 获取一级分类
    getFirstSortCode () {
      req('getFirstSortCode', {
      }).then(data => {
        this.firstSortOptions = data.data
        // this.firstSortOptions.firstSortName = data.data.sortName
        console.log('一级分类', data)
      })
    },
    // 传入所选的一级分类编号，并获取二级分类信息
    getSecondSortCode (value) {
      console.log('value', value)
      value = value.split('|')
      this.dialogFormData.firstSortCode = value[1]
      this.dialogFormData.firstSortName = value[0]
      this.clickSortCode = value[1]
      // console.log('hahahaha', this.clickSortCode)
      // 获取二级分类
      req('getSecondSortCode', {
        sortCode: this.clickSortCode
      }).then(data => {
        // console.log('haha', this.clickSortCode)
        // this.dialogFormData.secondSortCode = ''
        // this.secondSortOptions = []
        this.secondSortOptions = data.data
        console.log('二级分类', data)
      })
    },
    getSecondSortName (value) {
      console.log('value', value)
      value = value.split('|')
      this.dialogFormData.secondSortCode = value[1]
      this.dialogFormData.secondSortName = value[0]
    },
    // 修改列表时，选中商品，通过商品编号获取此商品的详细信息
    getCommData () {
      req('getCommData', {
        goodsCode: this.commCode
      }).then(data => {
        console.log('hahhahah', data)
        this.dialogFormData = Object.assign({}, data.data)
        this.dialogFormData.goodsCost = parseFloat(this.dialogFormData.goodsCost)
        this.dialogFormData.goodsPrice = parseFloat(this.dialogFormData.goodsPrice)
        // this.getSecondSortCode(this.clickSortCode)
      })
    },
    // 修改商品状态
    editCommState (goodsCode, state, version, tipInfo) {
      req('editCommState', {
        goodsCode: goodsCode,
        state: state,
        version: version
      }).then(data => {
        if (data.code === 0) {
          this.fetch()
          this.$message.success(tipInfo)
        } else {
          this.$message.error(data.msg)
        }
        this.commVersion = ''
        this.commCode = ''
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
      this.getSelectCommCode = rows
      console.log('rows', rows)
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'addComm') {
            req('addComm', {
              ...this.dialogFormData
            }).then(data => {
              // console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'editComm') {
            req('editComm', {
              ...this.dialogFormData,
              goodsCode: this.commCode,
              version: this.commVersion
            }).then(data => {
              // this.dialogFormData = Object.assign({}, data.data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.dialogVisible = false
                this.$refs.form.resetFields()
                this.fetch()
                // this.$refs.upload.clearFiles()
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        }
      })
    },
    dialogBeforeClose () {
      console.log(111)
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
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
.photopath {
  width: 200px;
  height: 30px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
