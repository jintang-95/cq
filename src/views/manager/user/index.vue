<template>
  <div class="system-page">
    <div class="filter-box">
      <UserFilter @search="handleSearchTop" />
      <div class="filter-right">
        <UserForm modalTitle="新增用户" />
        <a-button type="primary" @click="onMutipleDelete">
          删除
        </a-button>
        <a-button type="primary" @click="onMutipleReset">
          重置密码
        </a-button>
      </div>
    </div>
    <a-table
      rowKey="userId"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :columns="tableColumns"
      :data-source="users.rows"
      :pagination="users.pagination"
      @change="handleSearch"
    >
      <span slot="switch" slot-scope="record">
        <a-popconfirm
          title="是否确修改账号状态？"
          ok-text="修改"
          cancel-text="取消"
          @confirm="(event) => handleSwitch(event, record)"
        >
          <a-switch :checked="record.isLock" />
        </a-popconfirm>
      </span>
      <span class="table-actions" slot="action" slot-scope="record">
        <ViewDetail
          modalTitle="查看详情"
          :columns="detailColumns"
          :record="record"
        />
        <UserForm
          modalTitle="编辑用户"
          buttonText="编辑"
          :buttonGhost="true"
          :record="record"
        />
        <UserAuth modalTitle="用户授权" :buttonGhost="true" :record="record" />
        <!-- <a-popconfirm
          title="是否确认重置密码？"
          ok-text="重置"
          cancel-text="取消"
          @confirm="() => handleReset(record)"
        >
          <a-button type="danger" ghost>
            重置密码
          </a-button>
        </a-popconfirm> -->
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
import UserForm from "./form";
import UserAuth from "./auth";
import UserFilter from "./filter";
import ViewDetail from "./detail";

@Component({
  components: {
    UserForm,
    UserAuth,
    UserFilter,
    ViewDetail,
  },
})
export default class System extends Vue {
  get users() {
    const { rows, ...pagination } = this.$store.state.users;
    return {
      rows,
      pagination,
    };
  }

  tableColumns = [
    {
      title: "序号",
      dataIndex: "userId",
    },
    {
      title: "用户",
      dataIndex: "userName",
      ellipsis: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "手机",
      dataIndex: "mobile",
    },
    {
      title: "所属组织",
      dataIndex: "groupName",
      ellipsis: true,
    },
    {
      title: "员工状态",
      dataIndex: "userType",
    },
    // {
    //   title: "账号状态",
    //   key: "isLock",
    //   scopedSlots: { customRender: "switch" },
    // },
    {
      title: "操作",
      key: "action",
      width: 320,
      scopedSlots: { customRender: "action" },
    },
  ];

  detailColumns = [
    {
      title: "账号",
      key: "userName",
    },
    {
      title: "姓名",
      key: "name",
    },
    {
      title: "手机",
      key: "mobile",
    },
    {
      title: "邮箱",
      key: "email",
    },
    {
      title: "员工状态",
      key: "userType",
    },
    {
      title: "所属组织",
      key: "groupName",
    },
  ];

  selectedRowKeys = [];

  created() {
    this.$store.dispatch("queryUser");
  }

  onSelectChange(selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys;
  }

  onMutipleReset() {
    if (!this.selectedRowKeys.length) {
      return this.$message.warn("请选择用户");
    }
    this.$confirm({
      title: "重置密码提醒",
      content: "是否确认重置密码？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.$store.dispatch("resetPassword", this.selectedRowKeys);
      },
    });
  }
  onMutipleDelete() {
    if (!this.selectedRowKeys.length) {
      return this.$message.warn("请选择用户");
    }
    this.$confirm({
      title: "删除提醒",
      content: "是否确认删除？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        this.$store.dispatch("delUser", this.selectedRowKeys);
        this.selectedRowKeys = [];
      },
    });
  }
handleSearchTop(params) {
    this.$store.commit('setuserSearchName', params.username)
    // console.log(this.$store.state.userSearchName)
    this.selectedRowKeys = [];
    this.$store.dispatch("queryUser", params);
  }
  handleSearch(params) {
    this.selectedRowKeys = [];
    if(this.$store.state.userSearchName.length == 0){
      this.$store.dispatch("queryUser", params);
    }else{
      this.$store.dispatch("queryUser", {username:this.$store.state.userSearchName,...params});
    }
  }
  handleSwitch(event, record) {
    event.preventDefault();
    const { accountStatus } = record;
    this.$store.dispatch("updateUser", {
      ...record,
      accountStatusText: accountStatus ? "禁用" : "启用",
      accountStatus: !accountStatus,
    });
    this.$message.success(`已${accountStatus ? "禁用" : "启用"}该账号`);
  }
  handleReset(record) {
    this.$store.dispatch("resetPassword", [record.userId]);
  }
  handleDelete(record) {
    this.$store.dispatch("delUser", [record.userId]);
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
