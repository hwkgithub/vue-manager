<template>
  <!-- 左侧菜单栏 -->
  <el-menu
    unique-opened
    :collapse="isCollapse"
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item
      :index="item.path"
      v-for="item in noChildren"
      :key="item.path"
      @click="clickMenu(item)"
    >
      <i :class="'el-icon-' + item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu index="index" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i :class="'el-icon-' + item.icon"></i>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subItem.path"
          v-for="(subItem, subIndex) in item.children"
          :key="subIndex"
          @click="clickMenu(subItem)"
        >
          {{ subItem.label }}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
//封装的左侧导航菜单
import navmenu from "../config/navmenu.js";
export default {
  //计算属性
  computed: {
    //没有子菜单
    noChildren() {
      return this.menu.filter((item) => !item.children);
    },
    //有子菜单
    hasChildren() {
      return this.menu.filter((item) => item.children);
    },
    isCollapse() {
      // 这里的数据就是从vuex取得
      return this.$store.state.tab.isCollapse;
    },
  },
  data() {
    return {
      //获取菜单栏数据并赋值给menu
      menu: navmenu,
    };
  },
  methods: {
    clickMenu(item) {
      this.$store.commit("selectMenu", item);
    },
  },
};
</script>
<style scoped>
.el-menu {
  height: 100%;
  border: none;
}
.el-menu {
  height: 100%;
  border: none;
}
h3 {
  color: #ffffff;
  text-align: center;
  line-height: 50px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>