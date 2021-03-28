<template>
  <div>
    <a-form :form="form">
      <a-row :gutter="24" v-for="k in form.getFieldValue('keys')" :key="k">
        <a-col :span="10">
          <a-form-item :required="true">
            <a-input
              :maxLength="50"
              v-decorator="[
                `label[${k}]`,
                {
                  validateTrigger: ['change', 'blur'],
                  rules: [{ required: true, message: '请输入账号' }],
                },
              ]"
              placeholder="请输入账号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item :required="true">
            <a-input
              :maxLength="50"
              v-decorator="[
                `value[${k}]`,
                {
                  validateTrigger: ['change', 'blur'],
                  rules: [{ required: true, message: '请输入密码' }],
                },
              ]"
              type="password"
              placeholder="请输入密码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item>
            <span class="del-btn" @click="() => remove(k)">删除</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-button type="primary" @click="add">
      添加账号
    </a-button>
  </div>
</template>

<script>
export default {
  name: "SystemArrayForm",
  props: {
    record: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      id: 0,
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "dynamic_form_item" });
    this.form.getFieldDecorator("keys", { initialValue: [], preserve: true });
  },
  mounted() {
    if (this.record?.length) {
      // console.log(this.record.twebsiteUsers)
      const keys = [];
      const label = [];
      const value = [];
      this.record?.forEach((item) => {
        keys.push(this.id++);
        label.push(item.websiteUserName);
        value.push(item.websiteUserPassword);
      });
      this.form.setFieldsValue({ keys });
      this.$nextTick(() => {
        this.form.setFieldsValue({ label, value });
      });
    }
  },
  methods: {
    remove(k) {
      const keys = this.form.getFieldValue("keys");
      this.form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
    },

    add() {
      const { form } = this;
      const keys = form.getFieldValue("keys");
      const nextKeys = keys.concat(this.id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    },

    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          console.log(values)
          err && reject(err);
          const { keys, label, value } = values;
          const result = keys.map((key) => ({
            websiteUserName: label[key],
            websiteUserPassword: value[key],
          }));
          resolve(result);
        });
      });
    },
  },
};
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
.del-btn {
  cursor: pointer;
}
</style>
