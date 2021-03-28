<template>
  <a-form class="system-filter" layout="inline" :form="form">
    <a-form-item label="系统名称">
      <a-input
        :maxLength="50"
        allow-clear
        v-decorator="['websiteName']"
        placeholder="请输入系统名称"
      />
    </a-form-item>
    <a-form-item label="场景">
      <a-input
        :maxLength="50"
        allow-clear
        v-decorator="['sceneName']"
        placeholder="请输入系统场景"
      />
    </a-form-item>
    <a-form-item label="领域">
      <a-input
        :maxLength="50"
        allow-clear
        v-decorator="['field']"
        placeholder="请输入系统领域"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSearch">
        查询
      </a-button>
      <a-button @click="handleReset">
        重置
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: "SystemFilter",
  data() {
    return {
      form: this.$form.createForm(this, { name: "system-filter" }),
    };
  },
  computed: {},
  methods: {
    handleSearch() {
      this.$emit("search", this.form.getFieldsValue());
    },
    handleReset() {
      this.form.resetFields();
    },
  },
};
</script>

<style scoped>
.system-filter {
  text-align: left;
}
.system-filter .ant-btn + .ant-btn {
  margin-left: 10px;
}
</style>
