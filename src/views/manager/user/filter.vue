<template>
  <a-form class="user-filter" layout="inline" :form="form">
    <a-form-item label="用户">
      <a-input
        :maxLength="50"
        allow-clear
        v-decorator="['username']"
        placeholder="请输入用户名称"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="handleSearch">
        查询
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: "UserFilter",
  data() {
    return {
      form: this.$form.createForm(this, { name: "user-filter" }),
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
.user-filter {
  text-align: left;
  padding-bottom: 20px;
}
</style>
