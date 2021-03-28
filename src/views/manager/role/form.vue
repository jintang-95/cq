<template>
  <a-button type="primary" :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "新增角色" }}
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="okText"
      :bodyStyle="bodyStyle"
      :width="700"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消"
    >
      <a-form :form="form">
        <a-form-item label="名称">
          <a-input
            :maxLength="50"
            v-decorator="[
              'roleName',
              {
                rules: [{ required: true, message: '请输入角色名称' }],
              },
            ]"
            placeholder="请输入角色名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="授权">
          <a-table
            rowKey="id"
            :row-selection="{
              selectedRowKeys: checkedKeys,
              onChange: handleCheck,
            }"
            :columns="tableColumns"
            :data-source="websites.rows"
            :pagination="websites.pagination"
            @change="handlePageChange"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-button>
</template>
<script>
import fetchApi from "@/api/index";

export default {
  name: "RoleForm",
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
      checkedKeys: [],
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
  },
  methods: {
    showModal() {
      this.visible = true;
      this.form.resetFields();
      this.$store.dispatch("queryWebsite");
      if (this.record) {
        this.okText = "保存";
        fetchApi({
          apiPath: `/tRole/queryUserRoleById/${this.record.id}`,
        }).then((result) => {
          const { roleName, permissionId } = result.data;
          this.form.setFieldsValue({
            roleName,
          });
          this.checkedKeys = permissionId || [];
        });
      }
    },
    handlePageChange(params) {
      this.$store.dispatch("queryWebsite", params);
    },
    handleCheck(keys) {
      this.checkedKeys = keys;
    },
    handleOk() {
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.confirmLoading = true;
          if (this.record) {
            fetchApi({
              method: "put",
              apiPath: `/tRole/updateRole`,
              params: {
                ...values,
                id: this.record.id,
                permissionId: this.checkedKeys,
              },
            })
              .then(() => {
                this.visible = false;
                this.$message.success("修改成功");
                this.$store.dispatch("queryRole");
              })
              .finally(() => {
                this.confirmLoading = false;
              });
          } else {
            fetchApi({
              method: "post",
              apiPath: `/tRole/addWebsiteRoleUser`,
              params: {
                ...values,
                permissionId: this.checkedKeys,
              },
            })
              .then(() => {
                this.visible = false;
                this.$message.success("添加成功");
                this.$store.dispatch("queryRole");
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
