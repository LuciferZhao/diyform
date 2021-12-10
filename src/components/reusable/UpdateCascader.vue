<template>
  <div id="UpdateCascader" v-if="options !== null && options.length !== 0">
    <div v-for="(option, indexO) in options" :key="indexO">
      <h4>{{ optionName }}{{ indexO + 1 }}</h4>
      <el-input
        style="width: 30%; margin: 0 2% 0 0"
        v-model="option.label"
        @blur="updateValue(indexO, option.label)"
      ></el-input>
      <el-button
        type="primary"
        plain
        size="mini"
        @click="addChildrenOption(indexO, optionName + (indexO + 1))"
      >
        添加子项
      </el-button>
      <el-button type="danger" plain size="mini" @click="deleteOption(indexO)">
        删除
      </el-button>
      <UpdateCascader
        v-if="option.children !== null"
        :recursionOption="option.children"
        :fatherName="optionName + (indexO + 1)"
      >
      </UpdateCascader>
    </div>
  </div>
</template>

<script>
import UpdateCascader from "./UpdateCascader.vue";
export default {
  name: "UpdateCascader",
  data() {
    return {
      options: null,
      optionName: "",
    };
  },
  components: { UpdateCascader },
  props: ["recursionOption", "fatherName"],
  methods: {
    // 增加子选项
    addChildrenOption(indexO, fatherTitle) {
      if (this.options[indexO].children === null) {
        this.$set(this.options[indexO], "children", []);
      }
      let LabelAndValue =
        fatherTitle + "-" + (this.options[indexO].children.length + 1);
      let newPush = {
        value: LabelAndValue,
        label: LabelAndValue,
        children: null,
      };
      this.options[indexO].children.push(JSON.parse(JSON.stringify(newPush)));
    },
    // 删除选项
    deleteOption(indexO) {
      this.options.splice(indexO, 1);
    },
    // 修改label值同步修改value值
    updateValue(indexO, label) {
      this.options[indexO].value = label;
    },
  },
  mounted() {
    this.options = this.recursionOption;
    if (this.fatherName !== "选项") {
      this.optionName = this.fatherName + "-";
    } else {
      this.optionName = this.fatherName;
    }
  },
};
</script>

<style scoped>
#UpdateCascader {
  text-align: center;
}
</style>