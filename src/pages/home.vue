<template>
  <div>
    <el-container>
      <el-header height="80px">
        <router-link to="/user-manage">行走书店管理系统</router-link>
        <!-- <router-link to="/user-manage" @click="changeMenuActive">行走书店管理系统</router-link> -->
        <div class="user-info">
          <el-popover
            placement="top"
            v-model="visible">
            <el-button size="mini" type="text" @click="signOut">退出登录</el-button>
            <div slot="reference">
              <img v-show="role.photoPath" :src="role.photoPath">
              <img v-show="!role.photoPath" src="../assets/u18.jpg">
              <span>{{role.userName}}</span>
            </div>
          </el-popover>
        </div>
      </el-header>
      <el-container class="bodys">
        <el-aside width="200px">
          <el-menu ref="elmenu" default-active="/user-manage" @select="handlerSelect">
          <el-menu-item v-for="(item, index) in menuList" :index="item.menuRoute" :key="index">
            <span slot="title">{{item.menuName}}</span>
          </el-menu-item>
        </el-menu>
        </el-aside>
        <el-main>
          <router-view  default-active="./user-manage"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import req from '../api/home.js'
export default {
  name: 'home',
  data () {
    return {
      menuList: [
        // {title: '用户管理', path: '/user-manage'},
        // {title: '菜单管理', path: '/menu-manage'},
        // {title: '商品管理', path: '/comm-manage'},
        // {title: '首页轮播图管理', path: '/home-pic-manage'},
        // {title: '商品分类管理', path: '/comm-classify-manage'},
        // {title: '客户管理', path: '/client-manage'},
        // {title: '订单管理', path: '/order-manage'},
        // {title: '热门位商品管理', path: '/hot-comm-manage'},
        // {title: '门店信息管理', path: '/shop-info-manage'},
        // {title: '司机信息管理', path: '/driver-info-manage'}
      ],
      visible: false
    }
  },
  methods: {
    handlerSelect (key, path) {
      if (key !== this.$router.path) {
        this.$router.replace({path: key})
      }
    },
    // 改变左边栏状态
    // changeMenuActive () {
    //   this.$refs.class('is-active')
    // },
    signOut () {
      sessionStorage.clear('userInfo')
      sessionStorage.clear('roleInfo')
      this.$router.replace({path: '/login'})
    }
  },
  computed: {
    role () {
      return JSON.parse(sessionStorage.getItem('roleInfo'))
    }
  },
  mounted () {
  },
  created () {
    req('getAsideMenu', {
      role: parseInt(JSON.parse(sessionStorage.getItem('roleInfo')).role)
    }).then(data => {
      console.log('导航栏', data)
      this.menuList = data.data
    })
  }
}
</script>

<style lang='scss' scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(242, 242, 242);
  border-bottom: 1px solid rgb(204, 204, 204);

  a {
    font-size: 28px;
    color: #409EFF;
    text-decoration: none;
    margin-left: 25px;
  }

  .user-info {
    .el-popover__reference {
      display: flex;
      align-items: center;
      height: 100%;
      img {
        margin-right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      span {
        margin-right: 20px;
      }
    }
  }
.el-container {
  .bodys {
    height: 700px;
  }
}
.el-main {
  padding: 0;
  height: 800px;
}
}
</style>
