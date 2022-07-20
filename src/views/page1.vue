<template>
  <div>
    <div class="checklist" style="float: right">
      <div v-for="(item, index) in this.checklist" :key="index">
        <li>
          <span class="name">{{ index }}</span>
          <i :class="el-icon-loading"></i>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checklist: [],
    };
  },

  mounted() {
    this.getChecklist();
  },

  methods: {
    getChecklist() {
      this.axios
        .post(this.jlyBaseUrl + "/get_checklist/success")
        .then((result) => {
          this.checklist = result.data.data;
        });
    },
  },
};
</script>

<style>
.checklist .name {
  display: inline-block;
  width: 230px;
}
</style>