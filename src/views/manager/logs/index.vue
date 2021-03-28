<template>
  <div class="page">
    <a-table
      rowKey="id"
      :columns="tableColumns"
      :data-source="logInfo.rows"
      :pagination="logInfo.pagination"
      @change="handleSearch"
    />
  </div>
</template>
<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Logs extends Vue {
  get logInfo() {
    const { rows, ...pagination } = this.$store.state.logManger.logs;
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
      title: "网站名称",
      dataIndex: "websiteName",
      ellipsis: true,
    },
    {
      title: "访问数量",
      dataIndex: "num",
    },
  ];

  created() {
    this.handleSearch();
  }

  handleSearch(params) {
    this.$store.dispatch("queryWebLogs", params);
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
