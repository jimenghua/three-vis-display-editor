<template>
  <div class="operateNavigation-container">
    <el-button
      size="mini"
      type="primary"
      @click="screenshotDialogVisible = true"
    >
      快照
    </el-button>
    <!-- <el-button size="mini" type="primary" @click="exportDialogVisible = true">
      导出
    </el-button> -->
    <el-button size="mini" type="primary" @click="save">保存</el-button>
    <el-button size="mini" type="success" @click="build">构建</el-button>
    <el-button size="mini" type="info" @click="preivew">在线</el-button>
    <el-button size="mini" type="info" @click="download">下载</el-button>
    <el-dialog
      title="快照设置"
      :visible.sync="screenshotDialogVisible"
      width="30%"
      center
    >
      <el-form label-position="left" label-width="90px">
        <el-form-item label="文件名">
          <el-input size="mini" v-model="screenshotSetting.name"></el-input>
        </el-form-item>
        <el-form-item label="宽度（px）">
          <el-input-number
            size="mini"
            v-model="screenshotSetting.width"
            :controls="false"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="高度（px）">
          <el-input-number
            size="mini"
            v-model="screenshotSetting.height"
            :controls="false"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="screenshotDialogVisible = false">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="getScreenshot">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <!-- <el-dialog
      title="文件设置"
      :visible.sync="exportDialogVisible"
      width="30%"
      center
    >
      <el-form label-position="left" label-width="90px">
        <el-form-item label="文件名">
          <el-input size="mini" v-model="exportSetting.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="exportDialogVisible = false">
          取 消
        </el-button>
        <el-button size="mini" type="primary" @click="exportFile">
          确 定
        </el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { engine } from "@/assets/js/VisFrame";
import { JSONHandler } from "vis-three";

export default {
  data() {
    return {
      screenshotDialogVisible: false,
      exportDialogVisible: false,
      screenshotSetting: {
        width: 1920,
        height: 1080,
        name: "vis-screenshot",
      },

      exportSetting: {
        name: "vis-scene",
      },
      saveStatus: false,
    };
  },
  methods: {
    // async exportFile() {
    //   const loading = this.$loading({
    //     text: "正在导出文件...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.4)"
    //   });
    //   const config = engine.toJSON();
    //   const blob = new Blob([config], { type: "text/json" });

    //   const a = document.createElement("a");
    //   a.download = `${this.exportSetting.name}.json`;
    //   a.href = window.URL.createObjectURL(blob);
    //   a.click();
    //   loading.close();
    //   this.exportDialogVisible = false;
    //   this.exportSetting = {
    //     name: "vis-scene"
    //   };
    // },
    async getScreenshot() {
      const data = await engine.getScreenshot({
        width: this.screenshotSetting.width,
        height: this.screenshotSetting.height,
      });
      const a = document.createElement("a");
      a.download = this.screenshotSetting.name;
      a.href = data;
      a.click();
      this.screenshotDialogVisible = false;
      this.screenshotSetting = {
        width: 1920,
        height: 1080,
        name: "vis-screenshot",
      };
    },

    async save() {
      const loading = this.$message.loading("正在保存...");
      const config = engine.exportConfig();
      // config.component = this.$store.getters["component/get"];
      this.axios
        .post("/app/modify", {
          id: this.$store.getters.id,
          config: JSON.stringify(config, JSONHandler.stringify),
          preview: await engine.getScreenshot({
            width: 1920,
            height: 1080,
          }),
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.$message.success("保存成功！");
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    async build() {
      const tips = this.$notify.loading("正在构建应用,请稍后...");

      this.$socket.emit("buildApp", this.$store.getters.id);

      this.$socket.on("buildQueue", (res) => {
        if (!res.data) {
          tips.message = "正在构建应用,请稍后...";
        } else {
          tips.message = `当前排队人数：${res.data}`;
        }
      });

      this.$socket.on("builded", async (buildMessage) => {
        tips.close();
        if (buildMessage.status !== 200) {
          this.$message.error(buildMessage.message);
          return;
        }

        this.$notify({
          title: "构建成功！",
          type: "success",
        });

        this.$socket.off("buildQueue");
        this.$socket.off("builded");
      });
    },

    preivew() {
      window.open(`/app/${this.$store.getters.id}/dist`);
    },

    download() {
      const a = document.createElement("a");
      a.download = `${this.$store.getters.name}.zip`;
      a.href = `/app/${this.$store.getters.id}/dist.zip`;
      a.click();
    },
  },

  mounted() {
    engine.keyboardManager.register({
      shortcutKey: ["ctrl", "s"],
      desp: "在线保存",
      keydown: (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.save();
      },
    });
  },
};
</script>

<style lang="less" scoped>
.operateNavigation-container {
  .flexLayout(row, flex-end, center);
  padding-right: @box-padding;
}
</style>
