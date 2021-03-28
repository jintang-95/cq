<template>
  <a-button type="primary" :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "新增用户" }}
    <a-modal
      cancelText="取消"
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="okText"
      :bodyStyle="bodyStyle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="账号">
          <a-input
            :maxLength="50"
            :disabled="!!record"
            v-decorator="[
              'userName',
              {
                rules: [{ required: true, message: '请输入账号' }],
              },
            ]"
            placeholder="请输入账号"
          ></a-input>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input
            :maxLength="50"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入姓名' }],
              },
            ]"
            placeholder="请输入姓名"
          ></a-input>
        </a-form-item>
        <a-form-item label="密码" v-if="!record">
          <a-input
            :maxLength="50"
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码' }],
              },
            ]"
            type="password"
            placeholder="请输入密码"
          ></a-input>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input
            :maxLength="50"
            v-decorator="[
              'email',
              {
                rules: [
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱' },
                ],
              },
            ]"
            placeholder="请输入邮箱"
          ></a-input>
        </a-form-item>
        <a-form-item label="手机">
          <a-input
            :maxLength="50"
            v-decorator="[
              'mobile',
              {
                rules: [
                  { required: true, message: '请输入手机' },
                  {
                    pattern: /^[1-9]{3}[0-9]{8}$/,
                    message: '请输入正确的手机',
                  },
                ],
              },
            ]"
            placeholder="请输入手机"
          ></a-input>
        </a-form-item>
        <a-form-item label="组织">
          <a-input
            v-decorator="[
              'groupName',
              {
                rules: [{ required: true, message: '请输入组织' }],
              },
            ]"
            placeholder="请输入组织"
          ></a-input>
        </a-form-item>
        <a-form-item label="员工状态">
          <a-select
            :options="userOptions"
            v-decorator="[
              'userType',
              {
                rules: [{ required: true, message: '请选择员工状态' }],
              },
            ]"
            placeholder="请选择员工状态"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-button>
</template>
<script>
import fetchApi from "@/api/index";

export default {
  name: "UserForm",
  props: {
    modalTitle: {
      type: String,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
    buttonGhost: {
      type: Boolean,
      required: false,
    },
    record: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      userOptions: this.$store.state.options.user,
      scenesOptions: this.$store.state.options.scenes,
      accountOptions: this.$store.state.options.account,
      form: this.$form.createForm(this, { name: "user-form" }),
      okText: "创建",
      visible: false,
      confirmLoading: false,
      newRecord: {},
      bodyStyle: {
        maxHeight: "70vh",
        overflow: "scroll",
      },
    };
  },
  computed: {
    // deptTreeDate() {
    //   return this.$store.state.deptTree;
    // },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.form.resetFields();
      // this.$store.dispatch("queryDeptTree");
      if (this.record) {
        this.okText = "保存";
        setTimeout(() => {
          this.form.setFieldsValue(this.record);
          this.newRecord = { ...this.record };
        }, 0);
      }
    },
    handleOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          if (this.record) {
            fetchApi({
              method: "put",
              apiPath: `/tsysuser/update`,
              params: { ...this.newRecord, ...values },
            })
              .then(() => {
                this.visible = false;
                this.$message.success("更新成功");
                this.$store.dispatch("queryUser");
              })
              .finally(() => {
                this.confirmLoading = false;
              });
          } else {
            fetchApi({
              method: "post",
              apiPath: `/tsysuser/register`,
              params: values,
            })
              .then(() => {
                this.visible = false;
                this.$message.success("添加成功");
                this.$store.dispatch("queryUser");
              })
              .finally(() => {
                this.confirmLoading = false;
              });
          }
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
