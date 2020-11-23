<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="50%"
      @close="dialogClose"
      :before-close="dialogBeforeClose"
      :append-to-body="appendToBody">
      <slot></slot>
      <span slot="footer" class="dialog-footer" v-if="showButton">
        <el-button @click="dialogCancel">取消</el-button>
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'i-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showButton: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      dafault: false
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
  },
  methods: {
    dialogClose () {
      this.visible = false
      this.$emit('input', this.visible)
    },
    dialogBeforeClose () {
      this.$emit('dialog-before-close')
    },
    dialogCancel () {
      this.$emit('dialog-cancel')
    },
    dialogConfirm () {
      this.$emit('dialog-confirm')
    }
  },
  watch: {
    value: {
      handler (value) {
        this.visible = value
      },
      deep: true
    }
  },
  mounted () {
  }
}
</script>

<style lang='scss' scoped>
</style>
