<template>
  <div class="schedule">
    <div class="table">
      <el-table :data="scheduleData" stripe border>
        <el-table-column
          v-for="(item, index) in scheduleNum"
          :key="index"
          :prop="item.key"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="executeJob(scope.$index, scope.row)"
              :disabled="scope.row.mode === 'reactive' ? true : false"
              >执行</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="changeJobStatus(scope.$index, scope.row)"
              :disabled="scope.row.mode === 'reactive' ? true : false"
              >{{ scope.row.status === "Y" ? "禁用" : "开启" }}</el-button
            >
            <el-button
              type="text"
              size="mini"
              @click="updateJobInfo(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-dialog
              title="修改信息"
              :visible.sync="dialogVisible"
              width="30%"
              :close-on-click-modal="false"
            >
              <div>
                <span> 任务名称 </span>
                <el-input
                  v-model="jobName"
                  placeholder="输入任务名称"
                ></el-input>
                <span> 任务描述 </span>
                <el-input
                  v-model="description"
                  placeholder="输入任务描述"
                ></el-input>
                <span> 触发间隔 </span>
                <el-input
                  v-model="interval"
                  placeholder="输入触发间隔"
                ></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateJobInfoSubmit"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapMutations } from "vuex";

export default {
  name: "schedule",
  data() {
    return {
      scheduleNum: [
        { label: "任务编号", key: "jobId" },
        { label: "任务名称", key: "jobName" },
        { label: "任务描述", key: "description" },
        { label: "触发间隔", key: "interval" },
        { label: "当前状态", key: "status" },
        { label: "触发方式", key: "mode" },
        { label: "回传信息" },
      ],
      scheduleData: [],
      dialogVisible: false,
      jobName: "",
      description: "",
      interval: "",
      currentJodId: "",
    };
  },
  mounted() {
    this.getScheduleInfo();
  },
  computed: {
    ...mapState({
      timeOut: (state) => state.tab.timeOut,
      startTask: (state) => state.tab.startTask,
    }),
  },
  watch: {
    startTask() {
      let value = this.scheduleData.find((item) => {
        return item.jobId === "job001";
      });
      if (this.startTask) {
        // job001开启
        if (this.timeOut) {
          //超时，关闭job001
          value.status === "N";
          this.changeJobStatus(1, value);
        } else {
          // 成功，开启job001
          value.status === "Y";
          this.changeJobStatus(1, value);
        }
      } else {
        // 响应startTask关闭job001
        value.status === "N";
        this.changeJobStatus(1, value);
      }
    },
  },
  methods: {
    ...mapMutations({
      changeTimeOut: "changeTimeOut",
      changeTaskState: "changeTaskState",
    }),

    changeJobStatus(index, value) {
      const jobId = value.jobId;
      const status = value.status === "Y" ? "N" : "Y";
      const status_msg = { Y: "开启", N: "禁用" }[status];

      this.axios
        .post(
          this.jlyBaseUrl + "/change_job_status/success",
          JSON.stringify({
            job_id: jobId,
            status: status,
          })
        )
        .then((res) => {
          this.$message({
            message: status_msg + "成功！",
            type: "success",
          });
          this.getScheduleInfo();
        })
        .catch((error) => {
          this.$message.error(status_msg + "失败！");
          console.log(error);
        });
    },

    updateJobInfo(index, value) {
      this.dialogVisible = !this.dialogVisible;
      this.jobName = value.jobName;
      this.description = value.description;
      this.interval = value.interval;
      this.currentJodId = value.jobId;
    },

    updateJobInfoSubmit() {
      this.axios
        .post(
          this.jlyBaseUrl + "/update_job_info/success",
          JSON.stringify({
            job_id: this.currentJodId,
            job_name: this.jobName,
            description: this.description,
            interval: this.interval,
          })
        )
        .then((res) => {
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.getScheduleInfo();
          this.dialogVisible = false;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("修改失败！");
        });
    },

    getScheduleInfo() {
      this.scheduleData = [];
      this.axios
        .post(this.jlyBaseUrl + "/get_schedule_info/success")
        .then((res) => {
          if (res.data.code === -1) {
            alert(res.data.msg);
          } else {
            const jobInfo = res.data.data;
            const tableInfo = new Map();
            jobInfo.forEach((item) => {
              tableInfo.set(item.job_id, {
                jobId: item.job_id,
                jobName: item.job_name,
                description: item.description,
                interval: item.interval,
                status: item.status,
                mode: item.mode,
              });
            });
            this.scheduleData = [...tableInfo.values()];
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
</style>
