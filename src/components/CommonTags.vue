<template>
  <div class="tags">
    <!-- tags标签页 -->
    <el-tag
      :key="tag.name"
      v-for="(tag, index) in tags"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      @close="handleClose(tag, index)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonTags",
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    ...mapMutations({
      close: "closeTab",
    }),
    changeMenu(tag) {
      this.$store.commit("selectMenu", tag);
      this.$router.push({ name: tag.name });
    },
    handleClose(tag, index) {
      let length = this.tags.length - 1;
      this.close(tag);
      if (tag.name !== this.$route.name) {
        return;
      }
      if (index === length) {
        this.$router.push({ name: this.tags[index - 1].name });
      } else {
        this.$router.push({ name: this.tags[index].name });
      }
    },
  },
};
</script>
<style scoped>
.el-tag {
  margin: 1px;
}
.tags {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 35px;
  background-color: #fff;
  line-height: 32px;
  box-shadow: -1px -2px 5px 0px rgba(16, 16, 16, 0.75);
  -webkit-box-shadow: -1px -2px 5px 0px rgba(16, 16, 16, 0.75);
  -moz-box-shadow: -1px -2px 5px 0px rgba(16, 16, 16, 0.75);
}
</style>