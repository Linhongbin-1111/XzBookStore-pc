<template>
  <div class="i-search">
    <el-form ref="form" :inline="true" :model="model">
      <slot></slot>
      <el-form-item>
        <el-button @click="search" type="primary">查询</el-button>
        <el-button @click="reset" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'i-search',
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      formData: {
      }
    }
  },
  computed: {
  },
  methods: {
    search () {
      this.$emit('search')
    },
    reset () {
      this.$refs.form.resetFields()
      this.$emit('reset')
    }
  },
  mounted () {
  }
}
</script>

<style lang='scss' scoped>
.i-search {
  width: 94%;
  // padding: 10px;
  // margin-left: -40px;

  .el-form {
    /deep/ .el-form-item {  // deep 改变优先级，但是deep得是子元素，即他有父元素包着,deep下面的子元素都会优先级最高
      margin-bottom: 0;
      .el-form-item__label {
        width: 80px;
        // padding: 0 10px;
      }
      .el-form-item__content {
        .el-select {
          width: 206px;
        }
      }
    }
  }
.el-button {
  margin-left: 25px;
}
}
</style>
