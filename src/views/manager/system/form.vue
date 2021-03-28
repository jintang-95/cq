<template>
  <a-button type="primary" :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "新增网站" }}
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
        <a-form-item label="业务系统或支撑应用名称">
          <a-input
            :maxLength="50"
            v-decorator="[
              'websiteName',
              {
                rules: [{ required: true, message: '请输入应用名称' }],
              },
            ]"
            placeholder="请输入应用名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="模块">
          <a-input
            :maxLength="50"
            v-decorator="[
              'moduleType',
              {
                rules: [{ required: true, message: '请输入模块' }],
              },
            ]"
            placeholder="请输入模块名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="场景名称">
          <a-input
            :maxLength="50"
            v-decorator="[
              'sceneName',
              {
                rules: [{ required: true, message: '请输入场景名称' }],
              },
            ]"
            placeholder="请输入场景名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="领域">
          <a-tree-select
            :tree-data="fielsdOtptions"
            :replaceFields="{ value: 'value' }"
            v-decorator="[
              'fieldId',
              {
                rules: [{ required: true, message: '请选择领域' }],
              },
            ]"
            placeholder="请选择领域"
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="接入类型">
          <a-input
            :maxLength="50"
            v-decorator="[
              'accessType',
              {
                rules: [{ required: true, message: '请输入接入类型' }],
              },
            ]"
            placeholder="请输入接入类型"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item label="接入状态">
          <a-input
            :maxLength="50"
            v-decorator="[
              'moduleType',
              {
                rules: [{ required: true, message: '请输入接入状态' }],
              },
            ]"
            placeholder="请输入接入状态"
          ></a-input>
        </a-form-item> -->
        <a-form-item label="网络接入类型">
          <a-input
            :maxLength="50"
            v-decorator="[
              'websitesType',
              {
                rules: [{ required: true, message: '请输入网络接入类型' }],
              },
            ]"
            placeholder="请输入网络接入类型"
          ></a-input>
        </a-form-item>
        <a-form-item label="关注度">
          <a-input-number
            :maxLength="50"
            v-decorator="['attention']"
            placeholder="请输入关注度"
          ></a-input-number>
        </a-form-item>
        <!-- <a-form-item label="任务批次">
          <a-input
            :maxLength="50"
            v-decorator="[
              'taskBatches',
              {
                rules: [{ required: true, message: '请输入任务批次' }],
              },
            ]"
            placeholder="请输入任务批次"
          ></a-input>
        </a-form-item> -->
        <!-- 复制前 -->
        <a-form-item label="登录地址">
          <a-input
            :maxLength="50"
            v-decorator="[
              'websiteUrl',
              {
                rules: [
                  { required: true, message: '请输入登录地址' },
                  {
                    type: 'url',
                    message: '请输入正确的网站地址,如http://',
                  },
                ],
              },
            ]"
            placeholder="请输入登录地址"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item label="接入时间">
          <a-input
            :maxLength="50"
            v-decorator="[
              'accessTime',
              {
                rules: [{ required: true, message: '请输入接入时间' }],
              },
            ]"
            placeholder="请输入接入时间"
          ></a-input>
        </a-form-item> -->
        <a-form-item label="接入单位">
          <a-input
            :maxLength="50"
            v-decorator="[
              'accessDept',
              {
                rules: [{ required: true, message: '请输入接入单位' }],
              },
            ]"
            placeholder="请输入接入单位"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item label="属性">
          <a-input
            :maxLength="50"
            v-decorator="[
              'attribute',
              {
                rules: [{ required: true, message: '请输入属性' }],
              },
            ]"
            placeholder="请输入属性"
          ></a-input>
        </a-form-item> -->
        <a-form-item label="责任处室联系人">
          <a-input
            :maxLength="50"
            v-decorator="[
              'responseContactor',
              {
                rules: [{ required: true, message: '请输入责任处室联系人' }],
              },
            ]"
            placeholder="请输入责任处室联系人"
          ></a-input>
        </a-form-item>
        <a-form-item label="责任处室联系人电话">
          <a-input
            :maxLength="50"
            v-decorator="[
              'responsePhone',
              {
                rules: [
                  { required: true, message: '请输入责任处室联系人电话' },
                ],
              },
            ]"
            placeholder="请输入责任处室联系人电话"
          ></a-input>
        </a-form-item>
        <a-form-item label="场景核对数字重庆公司分工">
          <a-input
            :maxLength="50"
            v-decorator="[
              'sceneCheckDivision',
              {
                rules: [
                  { required: true, message: '请输入场景核对数字重庆公司分工' },
                ],
              },
            ]"
            placeholder="请输入场景核对数字重庆公司分工"
          ></a-input>
        </a-form-item>
        <a-form-item label="场景核对数字重庆公司分工联系人电话">
          <a-input
            :maxLength="50"
            v-decorator="[
              'sceneCheckDivisionPhone',
              {
                rules: [
                  {
                    required: true,
                    message: '场景核对数字重庆公司分工联系人电话',
                  },
                ],
              },
            ]"
            placeholder="场景核对数字重庆公司分工联系人电话"
          ></a-input>
        </a-form-item>
        <a-form-item label="是否提供解说词">
          <a-input
            :maxLength="50"
            v-decorator="[
              'commentary',
              {
                rules: [{ required: true, message: '是否提供解说词' }],
              },
            ]"
            placeholder="是否提供解说词"
          ></a-input>
        </a-form-item>
        <a-form-item label="解说词分工">
          <a-input
            :maxLength="50"
            v-decorator="[
              'commentaryDivisionScript',
              {
                rules: [{ required: true, message: '请输入解说词分工' }],
              },
            ]"
            placeholder="请输入解说词分工"
          ></a-input>
        </a-form-item>
        <a-form-item label="解说词脚本分工联系人电话">
          <a-input
            :maxLength="50"
            v-decorator="[
              'commentaryDivisionPhone',
              {
                rules: [
                  { required: true, message: '请输入解说词脚本分工联系人电话' },
                ],
              },
            ]"
            placeholder="请输入解说词脚本分工联系人电话"
          ></a-input>
        </a-form-item>
        <a-form-item label="接入单位">
          <a-input
            :maxLength="50"
            v-decorator="[
              'attribute',
              {
                rules: [{ required: true, message: '请输入接入单位' }],
              },
            ]"
            placeholder="请输入接入单位"
          ></a-input>
        </a-form-item>
        <a-form-item label="接入单位联系人">
          <a-input
            :maxLength="50"
            v-decorator="[
              'accessDeptContactor',
              {
                rules: [{ required: true, message: '请输入接入单位联系人' }],
              },
            ]"
            placeholder="请输入接入单位联系人"
          ></a-input>
        </a-form-item>
        <a-form-item label="接入单位联系人电话">
          <a-input
            :maxLength="50"
            v-decorator="[
              'accessDeptPhone',
              {
                rules: [
                  { required: true, message: '请输入接入单位联系人电话' },
                ],
              },
            ]"
            placeholder="请输入接入单位联系人"
          ></a-input>
        </a-form-item>
        <a-form-item label="预排名">
          <a-input
            :maxLength="50"
            v-decorator="['preliminaryRank']"
            placeholder="请输入预排名"
          ></a-input>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea
            v-decorator="['remark']"
            placeholder="请输入备注"
          ></a-textarea>
        </a-form-item>
        <!-- 复制后 -->
        <a-form-item label="登录账号">
          <SystemArrayForm
            ref="arrayForm"
            :record="form.getFieldValue('twebsiteUsers')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-button>
</template>
<script>
import fetchApi from "@/api/index";

import SystemArrayForm from "./array-form";

export default {
  name: "SystemForm",
  components: {
    SystemArrayForm,
  },
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
    addOrEdit: {
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
      form: this.$form.createForm(this, { name: "system-form" }),
      visible: false,
      confirmLoading: false,
      okText: "创建",
      bodyStyle: {
        maxHeight: "70vh",
        overflow: "scroll",
      },
    };
  },
  computed: {
    fielsdOtptions() {
      const fields = this.$store.state.fields;
      return fields.filter((item) => item.value !== this.record?.id);
    },
  },
  methods: {
    async showModal() {
      this.form.resetFields();
      this.$store.dispatch("queryFieldTree");
      if (this.record) {
        this.okText = "保存";
        const { data } = await fetchApi({
          apiPath: `/websiteinfo/queryInfoById/${this.record.id}`,
        });
        console.log(data);
        this.form.setFieldsValue({ ...data });
      }
      // debugger;
      this.visible = true;
    },
    // showModal() {
    //   this.visible = true;
    //   this.form.resetFields();
    //   this.$store.dispatch("queryFieldTree");
    //   if (this.record) {
    //     this.okText = "保存";
    //     setTimeout(() => {
    //       this.form.setFieldsValue(this.record);
    //     }, 0);
    //   }
    // },
    getFormValues() {
      return new Promise((resolve, reject) => {
        this.form.validateFieldsAndScroll((err, values) => {
          err && reject(err);
          if (this.record) {
            resolve({ ...this.record, ...values });
          } else {
            resolve({ ...values });
          }
        });
      });
    },
    async handleOk() {
      try {
        this.confirmLoading = true;
        const values = await this.getFormValues();
        const twebsiteUserVos = await this.$refs.arrayForm.handleSubmit();
        const params = { ...values, twebsiteUserVos };
        if (this.record) {
          fetchApi({
            method: "put",
            apiPath: `/websiteinfo/updatewebsiteinfo`,
            params,
          })
            .then(() => {
              this.visible = false;
              this.$message.success("更新成功");
              this.$store.dispatch("queryWebsite");
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        } else {
          fetchApi({
            method: "post",
            apiPath: `/websiteinfo/savewebsiteinfo`,
            params,
          })
            .then(() => {
              this.visible = false;
              this.$message.success("添加成功");
              this.$store.dispatch("queryWebsite");
            })
            .finally(() => {
              this.confirmLoading = false;
            });
        }
      } catch (error) {
        this.confirmLoading = false;
      }
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
