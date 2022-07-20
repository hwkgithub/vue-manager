<template>
  <div>
    <div class="task-table" v-show="selectValue === 'requestCase'">
      <div class="table-new">
        <span>项目编号：</span>
        <el-input v-model="projectNo" placeholder="输入项目编号"></el-input>
        <span>user_id：</span>
        <el-input v-model="userId" placeholder="输入用户 ID"></el-input>
        <el-button
          type="text"
          @click="searchCaseId"
          :disabled="!this.projectNo || !this.userId"
          :style="{ marginRight: '10px' }"
          >提交</el-button
        >
      </div>

      <div class="table-search">
        <span>案件编号：</span>
        <el-input v-model="caseNo" placeholder="输入案件编号"></el-input>
        <span>案件 ID：</span>
        <el-input v-model="caseId" placeholder="输入案件 ID"></el-input>
        <el-button
          type="text"
          @click="searchCaseInfo"
          :disabled="!this.caseId && !this.caseNo"
          :style="{ marginRight: '10px' }"
          >查询</el-button
        >

        <div class="table-checkbox">
          <div class="checkbox-project">
            <el-checkbox
              v-for="(item, index) in projectEnum.slice(3, projectEnum.length)"
              :key="index"
              :label="item.label"
              v-model="item.show"
            >
            </el-checkbox>
          </div>
          <div class="checkbox-strategy">
            <el-checkbox
              v-for="(item, index) in strategyEnum.slice(
                1,
                strategyEnum.length
              )"
              :key="index"
              :label="item.label"
              v-model="item.show"
            >
            </el-checkbox>
          </div>
        </div>

        <div class="table-recreate">
          <el-button
            type="text"
            @click="reCreateOrFinishCase('/re_create_case')"
            :style="{ marginRight: '10px' }"
            >重建案</el-button
          >
          <el-button
            type="text"
            @click="reCreateOrFinishCase('/finish_case')"
            :style="{ marginRight: '10px' }"
            >结案</el-button
          >
        </div>
      </div>

      <div class="timer">
        <div>
          <span style="margin-right: 10px">最大等待时间：</span>
          <el-input v-model="maxTime" placeholder="输入最大等待秒数"></el-input>
        </div>
        <div class="time">{{ str }}</div>
        <el-button type="text" @click="reset">停止</el-button>
      </div>

      <div class="table-bottom">
        <div class="table-project">
          <el-table
            :data="projectData"
            border
            stripe
            :cell-class-name="cellStyle"
          >
            <el-table-column
              v-for="(item, index) in showProject"
              :key="index"
              :prop="item.key"
              :label="item.label"
            >
            </el-table-column>
          </el-table>
        </div>
        <div class="table-strategy">
          <el-table
            :data="strategyData"
            stripe
            border
            :cell-class-name="cellStyle"
          >
            <el-table-column
              v-for="(item, index) in showStrategy"
              :key="index"
              :prop="item.key"
              :label="item.label"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";

export default {
  name: "caseOperation",
  props: ["selectValue"],
  data() {
    return {
      caseId: "",
      caseNo: "",
      projectNo: "",
      userId: "",
      projectEnum: [
        { label: "项目编码", key: "projectCode", show: true },
        { label: "创建时间", key: "createDatetime", show: true },
        { label: "提交时间", key: "applyDatetime", show: true },
        { label: "输入参数", key: "caseInput", show: false },
        { label: "输出参数", key: "caseOutput", show: false },
        { label: "策略路径", key: "strategyPath", show: false },
      ],
      strategyEnum: [
        { label: "策略编码", key: "strategyCode", show: true },
        { label: "策略输入", key: "strategyInput", show: false },
        { label: "策略输出", key: "strategyOutput", show: false },
        { label: "特征变量", key: "featureInfo", show: true },
        { label: "流程变量", key: "flowVariable", show: true },
        { label: "规则路径", key: "rulePath", show: false },
      ],
      projectData: [], // 项目Data
      strategyData: [], // 策略Data
      maxTime: 10, //最大等待时间
      // timeStatus: false, //计时器状态
      hours: 0, //定义时，分，秒，毫秒并初始化为0；
      minute: 0,
      second: 0,
      time: 0,
      str: "00:00:00",
    };
  },

  computed: {
    ...mapState({
      timeOut: (state) => state.tab.timeOut,
      startTask: (state) => state.tab.startTask,
    }),

    showProject() {
      return this.projectEnum.filter((val) => {
        return val.show;
      });
    },
    showStrategy() {
      return this.strategyEnum.filter((val) => {
        return val.show;
      });
    },
  },

  methods: {
    ...mapMutations({
      changeTimeOut: "changeTimeOut",
      changeTaskState: "changeTaskState",
    }),

    timerCalculation() {
      //定义计时函数
      this.second = this.second + 1; //秒
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1; //分钟
      }
      if (this.minute >= 60) {
        this.minute = 0;
        this.hours = this.hours + 1; //小时
      }

      // 计算时间是否大于最大等于时间
      if (this.hours * 3600 + this.minute * 60 + this.second > this.maxTime) {
        this.changeTimeOut(true); // 超时
        this.changeTaskState(false); //超时，关闭job001
        this.reset(); // 未成功返回，终止计时，归零
      }

      this.str =
        this.toDub(this.hours) +
        ":" +
        this.toDub(this.minute) +
        ":" +
        this.toDub(this.second) +
        "";
    },

    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },

    reset() {
      //重置
      clearInterval(this.time);
      this.hours = 0;
      this.minute = 0;
      this.second = 0;
      this.str = "00:00:00";
    },

    cellStyle(row, column, rowIndex, columnIndex) {
      let codeStrategyCode = row.row.strategyCode;
      if (codeStrategyCode && codeStrategyCode.search("E900") != -1) {
        return "strategy-fail-cell";
      } else {
        return "strategy-cell";
      }
    },

    reCreateOrFinishCase(url) {
      this.axios
        .post(
          this.jlyBaseUrl + url + "/success",
          JSON.stringify({
            case_id: this.caseId,
          })
        )
        .then((res) => {
          console.log(res, "rererererere");
          const caseInfo = res.data.data;
          if (res.code === 0) {
            this.caseId = caseInfo.case_id;
            this.searchCaseInfo();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    changeIntoJSON(dataObj) {
      /** 将对象转为JSON格式的字符串 */
      if (dataObj === null || dataObj === undefined) {
        // null&undefined不作处理
        return null;
      } else {
        let context = "{";
        for (let key in dataObj) {
          let value = dataObj[key];
          if (typeof value === "string") {
            // 区分数字和字符串
            value = '"' + value + '"';
          }
          context += '\n   "' + key + '": ' + value + ","; // 数据行处理成"key": value/"value"的格式
        }
        if (Object.keys(dataObj).length > 0) {
          context = context.slice(0, -1) + "\n"; // 去除数据行最后一位的","
        }
        context += "}";
        return context;
      }
    },

    searchCaseId() {
      // random_sleep：如果为-1，随机等待5~60秒,如果>0，指定等待random_sleep秒如果为0，则立即返回
      // random_return,如果为-1，有25%的概率返回失败,否则返回成功
      this.axios
        .post(
          this.jlyBaseUrl + "/get_case_id/success",
          JSON.stringify({
            project_no: this.projectNo,
            user_id: this.userId,
            random_sleep: -1,
            random_return: -1,
          })
        )
        .then((res) => {
          if (res.data.code === -1) {
            alert(res.data.msg);
          } else {
            const case_base_info = res.data.data;
            this.caseId = case_base_info.case_id;
            this.caseNo = case_base_info.case_no;
            this.searchCaseInfo();
          }
        })
        .catch((error) => {
          alert(error);
        });
    },

    searchCaseInfo() {
      this.projectData = [];
      this.strategyData = [];
      this.changeTaskState(true); //开启job001
      if (this.time) {
        clearInterval(this.time);
      }
      this.time = setInterval(this.timerCalculation, 1000); // 计时器开始

      this.axios
        .post(
          this.jlyBaseUrl + "/get_case_info/success",
          JSON.stringify({
            case_id: this.caseId,
            case_no: this.caseNo,
          })
        )
        .then((res) => {
          if (res.data.code === -1) {
            alert(res.data.msg);
          } else {
            /** 项目信息处理 */
            const case_info = res.data.data;
            if (case_info != null) {
              this.caseId = case_info.case_id;
              this.caseNo = case_info.case_no;

              this.projectData.push({
                projectCode: case_info.case_base_info.project_code,
                createDatetime: case_info.case_base_info.create_datetime,
                applyDatetime: case_info.case_base_info.apply_datetime,
                caseInput: this.changeIntoJSON(case_info.case_input_data),
                caseOutput: this.changeIntoJSON(case_info.case_output_data),
                strategyPath: JSON.stringify(case_info.case_strategy_path),
              });

              /** 策略信息处理 */
              const strategyInfo = case_info.case_strategy_info;
              for (let i = 0; i < strategyInfo.length; i++) {
                const strategyPartInfo = strategyInfo[i];
                let strategyCode = strategyPartInfo.strategy_code;
                let tableInfo = {};

                if (strategyCode != "E900") {
                  // 如果strategyCode不为E900, 则一定存在有效数据, 加入tableInfo
                  const featureData = strategyInfo[i].strategy_feature_data;
                  tableInfo["featureInfo"] =
                    "inner: " +
                    this.changeIntoJSON(featureData.inner) +
                    "\n\nthird: " +
                    this.changeIntoJSON(featureData.third) +
                    "\n\ndyna: " +
                    this.changeIntoJSON(featureData.dyna);

                  tableInfo["strategyInput"] = this.changeIntoJSON(
                    strategyPartInfo.strategy_input_data
                  );
                  tableInfo["strategyOutput"] = this.changeIntoJSON(
                    strategyPartInfo.strategy_output_data
                  );
                  tableInfo["flowVariable"] = this.changeIntoJSON(
                    strategyPartInfo.strategy_flow_variable
                  );
                  tableInfo["rulePath"] = JSON.stringify(
                    strategyPartInfo.strategy_rule_path
                  );
                } else {
                  strategyCode +=
                    "\n\n[" +
                    strategyPartInfo.error_code +
                    "] " +
                    strategyPartInfo.error_reason;
                }
                tableInfo["strategyCode"] = strategyCode;
                this.strategyData.push(tableInfo);
              }

              this.changeTimeOut(false); // 未超时
              this.changeTaskState(false); // 成功返回，关闭job001
              this.reset(); // 返回成功，终止计时，归零
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style >
.table-new {
  padding: 28px 0;
}

.table-new .el-input {
  width: 300px;
  height: 44px;
  padding-right: 20px;
}

.table-search .el-input {
  width: 300px;
  height: 44px;
  padding-right: 20px;
}

.table-search .table-checkbox {
  display: inline-flex;
  padding: 26px 0;
}

.table-checkbox .checkbox-project {
  display: inline-block;
  margin-right: 30px;
}

.table-checkbox .checkbox-strategy {
  display: inline-block;
}

.table-recreate {
  display: inline-flex;
  margin-left: 24px;
}

.el-table .strategy-cell .cell {
  white-space: pre-line !important;
}

.el-table .strategy-fail-cell .cell {
  white-space: pre-line !important;
}

.timer {
  display: flex;
  justify-content: space-between;
  width: 500px;
  padding: 20px 0;
}

.timer .el-input {
  width: 200px;
  height: 44px;
}

.timer .time {
  line-height: 42px;
}
</style>
