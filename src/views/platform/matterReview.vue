<template>
  <div>
    <div class="task-input" v-show="selectValue === 'auditObject'">
      <div class="enter">
        <span>策略/项目编号：</span>
        <el-input
          placeholder="用英文逗号分割 最多同时处理10个"
          v-model="codeInput"
          maxlength="128"
        >
        </el-input>
        <el-radio-group v-model="auditResult" class="auditResult">
          <el-radio label="Y">通过</el-radio>
          <el-radio label="N">驳回</el-radio>
        </el-radio-group>

        <el-button
          type="text"
          @click="submitData"
          :disabled="!this.codeInput || !this.auditResult"
          :style="{ marginRight: '10px' }"
          >提交</el-button
        >
        <el-radio-group v-model="object" class="object">
          <el-radio label="strategy">策略</el-radio>
          <el-radio label="project">项目</el-radio>
        </el-radio-group>
        <div class="auditResultMsg">{{ this.auditResultMsg }}</div>
      </div>

      <div class="show-input">
        <el-input
          v-if="this.auditResult === 'N'"
          placeholder="输入驳回原因"
          v-model="refuseMsg"
        >
        </el-input>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "matterReview",
  props: ["selectValue"],
  data() {
    return {
      codeInput: "", // 编号
      refuseMsg: "", // 驳回输入框value
      auditResult: "Y", // 通过/驳回 Y/N
      object: "strategy", // 策略/项目 strategy/project
      auditResultMsg: "", // 复核结果
    };
  },
  methods: {
    submitData() {
      let codeInputList = this.codeInput.replace(/\s+/g, "").split(",");
      if (codeInputList.legnth > 10) {
        alert("单次最大可处理数为10个！");
      } else {
        this.$confirm("确认提交?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let data = {
              object: this.object,
              object_code_list: codeInputList,
              audit_result: this.auditResult,
            };
            if (this.auditResult === "N") {
              data["refuse_msg"] = this.refuseMsg;
            }
            this.axios
              .post(
                this.jlyBaseUrl + "/audit_object/success",
                JSON.stringify(data)
              )
              .then((res) => {
                this.auditResultMsg = res.data.msg;
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch(() => {});
      }
    },
  },
};
</script>

<style >
.enter .el-input {
  width: 300px;
  height: 44px;
  padding-right: 20px;
}

.enter .el-radio-group {
  padding-right: 30px;
}

.enter .object {
  display: block;
  padding: 20px 0;
}

.enter .auditResultMsg {
  color: red;
  padding: 20px 0;
}
</style>
