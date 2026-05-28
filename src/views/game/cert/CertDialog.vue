<template>
  <el-dialog
    :visible.sync="innerVisible"
    :title="dialogTitle"
    :width="dialogWidth"
    :destroy-on-close="true"
    append-to-body
    custom-class="cert-dialog"
    @opened="handleOpened"
  >
    <div class="cert-dialog__body">
      <div v-if="errorMsg" class="cert-dialog__error">{{ errorMsg }}</div>
      <canvas
        v-show="!errorMsg"
        ref="canvas"
        class="cert-dialog__canvas"
      ></canvas>
    </div>
  </el-dialog>
</template>

<script>
import { renderCert } from "./useCanvasRenderer";
import {
  JOIN_CERT_CONFIG,
  AWARD_CERT_CONFIG,
  JOIN_CERT_BG,
  AWARD_CERT_BG,
} from "./certConfig";

const CERT_META = {
  join: {
    title: "参赛证书",
    config: JOIN_CERT_CONFIG,
    background: JOIN_CERT_BG,
  },
  award: {
    title: "获奖证书",
    config: AWARD_CERT_CONFIG,
    background: AWARD_CERT_BG,
  },
};

export default {
  name: "CertDialog",
  props: {
    visible: { type: Boolean, default: false },
    certType: { type: String, default: "join" },
    certData: { type: Object, default: null },
  },
  data() {
    return {
      innerVisible: this.visible,
      errorMsg: "",
    };
  },
  computed: {
    meta() {
      return CERT_META[this.certType] || CERT_META.join;
    },
    dialogTitle() {
      return this.meta.title;
    },
    dialogWidth() {
      if (typeof window !== "undefined" && window.innerWidth <= 768) {
        return "90%";
      }
      return "720px";
    },
  },
  watch: {
    visible(val) {
      this.innerVisible = val;
      if (!val) {
        this.errorMsg = "";
      }
    },
    innerVisible(val) {
      if (val !== this.visible) {
        this.$emit("update:visible", val);
      }
    },
  },
  methods: {
    async handleOpened() {
      this.errorMsg = "";
      await this.$nextTick();
      const canvas = this.$refs.canvas;
      if (!canvas) {
        this.errorMsg = "证书生成失败：画布未就绪";
        return;
      }
      const parent = canvas.parentElement;
      const maxWidth = parent ? parent.clientWidth || 600 : 600;
      try {
        await renderCert(
          canvas,
          this.meta.config,
          this.meta.background,
          this.certData,
          maxWidth
        );
      } catch (err) {
        console.error("[CertDialog] render error", err);
        this.errorMsg = "证书生成失败，请稍后再试";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cert-dialog {
  &__body {
    text-align: center;
  }

  &__canvas {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  &__error {
    padding: 32px 16px;
    color: #c0392b;
    font-size: 14px;
  }
}
</style>
