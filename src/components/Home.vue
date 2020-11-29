<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>后台管理</span>
      </div>
      <el-button type="danger" round @click="back">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧区域 -->
      <el-aside :width="isprend ? '64px' : '200px'">
        <!-- 收缩条 -->
        <div class="toggle-button" @click="collBtn">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isprend"
          :collapse-transition="false"
          :router="true"
          :default-active="defaulactiv"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulists"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/home/' + itemsub.path"
              v-for="itemsub in item.children"
              :key="itemsub.id"
              @click="saveNavStatus('/home/' + itemsub.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ itemsub.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 是否折叠
      isprend: false,
      menulists: [],
      iconList: {
        125: "el-icon-user-solid",
        103: "el-icon-unlock",
        101: "el-icon-shopping-bag-2",
        102: "el-icon-document",
        145: "el-icon-s-marketing",
      },
      // 默认高亮
      defaulactiv: "",
    };
  },
  // 生命周期函数
  created() {
    this.getMenuList();
    this.defaulactiv = window.sessionStorage.getItem("activpath");
  },
  methods: {
    // 实现退出功能
    back() {
      // 1.清空本地token clear是删除全部 remove 是移除单个
      // window.sessionStorage.clear("token");
      window.sessionStorage.removeItem("token");
      // 2.跳转到登录页
      this.$router.replace("/login");
    },
    // 获取菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulists = res.data;
      // console.log(res.data);
    },
    // 列表伸缩
    collBtn() {
      this.isprend = !this.isprend;
    },
    // 导航状态
    saveNavStatus(sta) {
      window.sessionStorage.setItem("activpath", sta);
      this.defaulactiv = sta;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-menu {
  border-right: 0;
}
.toggle-button {
  width: 100%;
  height: 20px;
  line-height: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.2em;
  background-color: pink;
  text-align: center;
  cursor: pointer;
}
.el-header {
  padding-left: 0;
  background-color: #fbda41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    padding: 0;
    width: 150px;
    height: 50px;
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 100%;
    }
    span {
      font-size: 20px;
    }
  }
}
.el-aside {
  background-color: #f28e16;
}
// .el-main {
//   background-color: #ef82a0;
// }
</style>