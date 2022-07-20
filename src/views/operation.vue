
<template>
  <div>
    <div class="operation-top">
      <el-row class="env-button" v-show="showEnvButton">
        <span>测试环境：</span>
        <el-radio-group v-model="envSelected" @change="initEnvironment">
          <el-radio-button
            v-for="(item, index) in env"
            :key="index"
            :label="item"
          ></el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row class="vir-button" v-show="showEnvButton">
        <span>融担环境：</span>

        <el-radio-group v-model="virSelected" @change="initEnvironment">
          <el-radio-button
            v-for="(item, index) in vir"
            :key="index"
            :label="item"
          ></el-radio-button>
        </el-radio-group>
      </el-row>
      <span>执行事项：</span>

      <el-select
        v-model="selectValue"
        filterable
        placeholder="输入或选择执行事项"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="operation-bottom">
      <MatterReview :selectValue="selectValue" />
      <CaseOperation :selectValue="selectValue" />
    </div>
  </div>
</template>

<script type="text/javascript">
import MatterReview from "./platform/matterReview.vue";
import CaseOperation from "./platform/caseOperation.vue";

export default {
  name: "Operation",
  components: {
    MatterReview,
    CaseOperation,
  },
  data() {
    return {
      env: [],
      vir: [],
      envSelected: "test1", // 当前被选中的测试环境项
      virSelected: "xna", // 当前被选中的融担环境项
      showEnvButton: false,
      options: [],
      selectValue: "", // 下拉框value
    };
  },
  mounted() {
    this.getEnvironment();
  },
  methods: {
    /**
     * 获取环境信息
     */
    getEnvironment() {
      this.axios
        .post(this.jlyBaseUrl + "/get_environment/success")
        .then((res) => {
          const list = res.data.data;
          this.env = list.env;
          this.vir = list.vir;
          if (this.env.length === 0 || this.vir.length === 0) {
            alert("获取环境信息异常！");
          } else {
            this.showEnvButton = true;
            this.initEnvironment();
            this.getTaskList();
          }
        })
        .catch((error) => {
          alert("获取环境信息异常！");
        });
    },
    initEnvironment() {
      this.axios
        .post(
          this.jlyBaseUrl + "/init_environment/success",
          JSON.stringify({
            env: this.envSelected,
            vir: this.virSelected,
          })
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          alert("切换环境失败！");
        });
    },

    getTaskList() {
      this.axios
        .post(this.jlyBaseUrl + "/get_task_list/success")
        .then((res) => {
          const task_info = res.data.data;
          for (let task_name in task_info) {
            this.options.push({
              value: task_name,
              label: task_info[task_name],
            });
          }
          console.log(this.options);
        });
    },
  },
};
</script>
<style scoped>
.operation-bottom {
  width: 100%;
  height: 100%;
}
.env-button {
  margin-bottom: 20px;
}

.vir-button {
  margin-bottom: 20px;
}

.operation-top {
  padding-bottom: 40px;
}
</style>