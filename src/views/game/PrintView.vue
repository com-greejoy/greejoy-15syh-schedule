<template>
  <div class="print-view">
    <el-button @click="handleAdd()">新增打印数据</el-button>
    <el-button @click="handlePrint()">打印所有数据</el-button>
    <div style="margin-top: 20px;">
      <el-table :data="printDataList">
        <el-table-column prop="raceName" label="竞赛名称" />
        <el-table-column prop="sporterName" label="运动员姓名" />
        <el-table-column prop="result" label="名次与成绩" />
        <el-table-column prop="address" label="比赛地点" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index)"
            >
              删除
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-printer"
              @click="handlePrint(scope.row)"
            >
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--dialog-->
    <el-dialog
      title="添加打印数据"
      :visible.sync="open"
      width="600px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="竞赛名称" prop="raceName">
          <el-input
            v-model="form.raceName"
            placeholder="请输入竞赛名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="运动员姓名" prop="sporterName">
          <el-input
            v-model="form.sporterName"
            placeholder="请输入运动员姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="名次与成绩" prop="result">
          <el-input
            v-model="form.result"
            placeholder="请输入名次与成绩"
            clearable
          />
        </el-form-item>
        <el-form-item label="比赛地点" prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入比赛地点"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="reset">清空表单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myTemplate } from "@/config/print";
import { hiprint } from "vue-plugin-hiprint";

export default {
  name: "PrintView",
  components: {},
  data() {
    return {
      hiprintTemplate: {},
      printDataList: [],
      open: false,
      form: {
        raceName: null,
        sporterName: null,
        result: null,
        address: null
      },
      rules: {}
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      hiprint.init();
      this.hiprintTemplate = new hiprint.PrintTemplate({
        template: myTemplate
      });
    },
    reset() {
      this.form = {
        raceName: null,
        sporterName: null,
        result: null,
        address: null
      };
      this.$refs["formRef"]?.resetFields();
    },
    handleAdd() {
      this.open = true;
    },
    submitForm() {
      this.$refs["formRef"].validate(valid => {
        if (valid) {
          const data = { ...this.form };
          this.printDataList.push(data);
          this.open = false;
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    handlePrint(row) {
      const data = row ? [row] : this.printDataList;
      this.hiprintTemplate.print(data);
    },
    handleDelete(index) {
      this.printDataList.splice(index, 1);
    },
    //test
    testChangeTemplate() {
      console.log(this.hiprintTemplate);
      console.log(myTemplate2);
      this.hiprintTemplate.update(myTemplate2);
      console.log("update template");
    }
  }
};
</script>

<style lang="less" scoped>
.print-view {
}
</style>
