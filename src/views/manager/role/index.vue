<template>
  <div class="system-page">
    <div class="filter-box">
      <RoleFilter @search="handleSearch" />
      <div class="filter-right">
        <RoleForm modalTitle="新增角色" />
      </div>
    </div>
    <a-table
      rowKey="id"
      :columns="tableColumns"
      :data-source="roles.rows"
      :pagination="roles.pagination"
      @change="handleSearch"
    >
      <span class="table-actions" slot="action" slot-scope="record">
        <RoleForm
          modalTitle="编辑角色"
          buttonText="编辑"
          :buttonGhost="true"
          :record="record"
        />
        <a-popconfirm
          title="是否确认删除？"
          ok-text="删除"
          cancel-text="取消"
          @confirm="() => handleDelete(record)"
        >
          <a-button type="danger" ghost>
            删除
          </a-button>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>
<script>
import { Vue, Component } from "vue-property-decorator";
import RoleForm from "./form";
import RoleFilter from "./filter";

@Component({
  components: {
    RoleForm,
    RoleFilter,
  },
})
export default class System extends Vue {
  get roles() {
    const { rows, ...pagination } = this.$store.state.roles;
    return {
      rows,
      pagination,
    };
  }

  tableColumns = [
    {
      title: "序号",
      dataIndex: "id",
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      ellipsis: true,
    },
    {
      title: "操作",
      key: "action",
      width: 320,
      scopedSlots: { customRender: "action" },
    },
  ];

  created() {
    this.$store.dispatch("queryRole");
  }

  handleSearch(params) {
    this.$store.dispatch("queryRole", params);
  }
  handleDelete(record) {
    this.$store.dispatch("delRole", record.id);
  }
}
</script>

<style scoped>
.system-page {
  width: 100%;
  padding: 20px;
}

.filter-box {
  display: flex;
  justify-content: space-between;
}
.filter-right button {
  margin-right: 10px;
}

.table-actions button:not(:first-child) {
  margin-left: 10px;
}
</style>
