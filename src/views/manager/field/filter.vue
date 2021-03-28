<template>
  <a-form class="filter" layout="inline" :form="form">
    <a-form-item label="领域名称">
      <a-input
        :maxLength="50"
        allow-clear
        v-decorator="['name']"
        placeholder="请输入领域名称"
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
  name: "FieldFilter",
  data() {
    return {
      form: this.$form.createForm(this, { name: "filter" }),
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
.filter {
  text-align: left;
  padding-bottom: 20px;
}
</style>
