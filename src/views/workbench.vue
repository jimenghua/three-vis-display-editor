<template>
  <el-dialog
    title="我的应用"
    :visible.sync="visible"
    width="70vw"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="workbench-container">
      <file-system ref=""></file-system>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" v-if="!selected" @click="addNew">
        新 建
      </el-button>
      <el-button type="primary" size="mini" v-else @click="select">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
const fileSystem = () => import("./workbench/fileSystem.vue");
export default {
  components: {
    fileSystem,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    selected() {
      return this.$store.getters["appLibrary/selected"];
    },
  },
  methods: {
    addNew() {
      this.$prompt("应用名称", "新建应用", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        this.$axios
          .post("/app/create", {
            appName: value,
            classifyId: this.$store.getters["appLibrary/currentFloder"].id,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$store.commit("initProject", res.data.id);
              this.visible = false;
            } else {
              this.$message.error(res.message);
            }
          });
      });
    },
    select() {
      this.$store.commit("initProject", this.selected.id);
      this.visible = false;
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog {
  .el-dialog__body {
    height: 50vh;
  }
}
.workbench-container {
  .flexLayout(column, flex-start, flex-start);
  .boxSetting();
  background: @theme-backgroundColor;
}
</style>
