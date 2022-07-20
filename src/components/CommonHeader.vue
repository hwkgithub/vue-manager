<template>
  <header class="header">
    <div class="l-content">
      <el-button
        type="primary"
        icon="el-icon-menu"
        style="margin-right: 30px"
        @click="collapseMenu"
      ></el-button>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" @command="setDialogInfo">
        <span class="el-dropdown-link">
          下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      current: (state) => state.tab.currentMenu,
    }),
  },
  methods: {
    //控制左侧菜单是否折叠
    collapseMenu() {
      this.$store.commit("collapseMenu");
    },
    // 下拉框选择，点击个人信息后调整到对应的函数执行
    setDialogInfo(comItem) {
      switch (comItem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    //展示个人信息
    showInfoList() {
      this.$alert(
        `<div>
	            名称：admin
	            <br/>
	            身份：管理员
	          </div>`,
        "个人名片",
        {
          dangerouslyUseHTMLString: true,
        }
      );
    },
    logout() {
      this.$confirm("确定退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message.success("退出成功");
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>
<style scoped>
.header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.l-content {
  justify-content: space-between;
  display: flex;
  align-items: center;
}
.el-dropdown {
  color: #fff;
}
.el-breadcrumb /deep/ .el-breadcrumb__inner {
  color: #fff !important;
}
.el-breadcrumb__inner a {
  color: #fff !important;
}
</style>