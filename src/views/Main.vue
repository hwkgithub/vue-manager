<template>
  <div class="main">
    <el-container style="width: 100%; height: 100vh">
      <!-- 左侧导航栏 -->
      <el-aside width="auto">
        <CommonAside />
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <!-- <el-header>
          <CommonHeader />
        </el-header> -->
        <el-main>
          <!-- 标签栏 -->
          <CommonTags />
          <!-- 主题内容部分 -->
          <div class="content">
            <keep-alive>
              <router-view />
            </keep-alive>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "../components/CommonAside.vue";
// import CommonHeader from '../components/CommonHeader.vue'
import CommonTags from "../components/CommonTags.vue";
export default {
  name: "Main",
  components: {
    CommonAside,
    // CommonHeader,
    CommonTags,
  },
};
</script>
<style scoped>
.el-main {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.el-header {
  background-color: black;
  color: #fff;
}
.content {
  padding: 20px;
}
</style>
