<template>
  <a-button type="primary" :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "新增领域" }}
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="okText"
      :bodyStyle="bodyStyle"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消"
    >
      <a-form :form="form">
        <a-form-item label="领域名称">
          <a-input
            :maxLength="50"
            v-decorator="[
              'fieldName',
              {
                rules: [{ required: true, message: '请输入领域名称' }],
              },
            ]"
            placeholder="请输入领域名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="选择父级">
          <!-- <a-select
            :options="fields"
            allowClear
            v-decorator="['pid']"
            placeholder="请选择领域父级"
          ></a-select> -->
          <a-tree-select
            :tree-data="fields"
            :replaceFields="{ value: 'value' }"
            allowClear
            v-decorator="['pid']"
            placeholder="请选择领域"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-button>
</template>
<script>
import fetchApi from "@/api/index";

export default {
  name: "FieldForm",
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
      form: this.$form.createForm(this, { name: "role-form" }),
      okText: "创建",
      visible: false,
      confirmLoading: false,
      bodyStyle: {
        maxHeight: "70vh",
        overflow: "scroll",
      },
      tableColumns: [
        {
          title: "序号",
          dataIndex: "id",
        },
        {
          title: "业务系统或支撑应用名称",
          dataIndex: "websiteName",
        },
      ],
    };
  },
  computed: {
    websites() {
      const { rows, ...pagination } = this.$store.state.websites;
      return {
        rows,
        pagination,
      };
    },
    fields() {
      const fields = this.$store.state.fields;
      // let fieldsList: any[] = [];
      // fields.forEach((i) => {
      //   fieldsList.push(i)
      // });
      console.log()
      fields.forEach((item)=>{
        if(item.children){
          item.children.forEach((child=>{
            child.children=[]
          }))
        }
      })
      console.log(fields)
      return fields.filter((item) => item.value !== this.record?.id);
    },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.form.resetFields();
      this.$store.dispatch("queryFieldTree");
      if (this.record) {
        this.okText = "保存";
        setTimeout(() => {
          this.form.setFieldsValue({
            fieldName: this.record.name,
            pid: this.record.pid || "",
          });
        }, 0);
      }
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          if (this.record) {
            fetchApi({
              method: "put",
              apiPath: `/baseField/updateWebsiteUser`,
              params: {
                fieldId: this.record.id,
                ...values,
              },
            })
              .then(() => {
                this.visible = false;
                this.$message.success("修改成功");
                this.$store.dispatch("queryFieldList");
              })
              .finally(() => {
                this.confirmLoading = false;
              });
          } else {
            fetchApi({
              method: "post",
              apiPath: "/baseField/addWebsiteUser",
              params: {
                ...values,
              },
            })
              .then(() => {
                this.visible = false;
                this.$message.success("添加成功");
                this.$store.dispatch("queryFieldList");
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
