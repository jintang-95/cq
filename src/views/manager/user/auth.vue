<template>
  <a-button type="primary" :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "授权" }}
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :okText="okText"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700"
      cancelText="取消"
    >
      <a-table
        rowKey="id"
        :row-selection="{
          selectedRowKeys: checkedKeys,
          onChange: handleCheck,
        }"
        :columns="tableColumns"
        :data-source="roles.rows"
        :pagination="roles.pagination"
        @change="handlePageChange"
      />
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
      okText: "保存",
      visible: false,
      confirmLoading: false,
      checkedKeys: [],
      tableColumns: [
        {
          title: "序号",
          dataIndex: "id",
        },
        {
          title: "角色名称",
          dataIndex: "roleName",
        },
      ],
    };
  },
  computed: {
    roles() {
      const { rows, ...pagination } = this.$store.state.roles;
      return {
        rows,
        pagination,
      };
    },
  },
  methods: {
    showModal() {
      this.visible = true;
      this.checkedKeys = [];
      this.$store.dispatch("queryRole");
      if (this?.record) {
        fetchApi({
          apiPath: `/tUseRole/selectRoleUser/${this.record.userId}`,
        }).then((result) => {
          const { roleIds } = result.data;
          this.checkedKeys = roleIds || [];
        });
      }
    },
    handlePageChange(params) {
      this.$store.dispatch("queryRole", params);
    },
    handleOk() {
      this.confirmLoading = true;
      fetchApi({
        method: "post",
        apiPath: `/tUseRole/addRoleUser`,
        params: {
          userId: this.record.userId,
          roleIds: this.checkedKeys,
        },
      })
        .then(() => {
          this.visible = false;
          this.$message.success("授权成功");
          this.$store.dispatch("queryUser");
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },
    handleCancel() {
      this.visible = false;
    },
    handleCheck(keys) {
      this.checkedKeys = keys;
    },
  },
};
</script>
