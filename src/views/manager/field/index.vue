<template>
  <div class="system-page">
    <div class="filter-box">
      <FieldFilter @search="handleSearchTop" />
      <div class="filter-right">
        <FieldForm modalTitle="新增领域" />
      </div>
    </div>
    <a-table
      rowKey="id"
      :columns="tableColumns"
      :data-source="fields.rows"
      :pagination="fields.pagination"
      @change="handleSearch"
    >
      <span class="table-actions" slot="action" slot-scope="record">
        <FieldForm
          modalTitle="编辑领域"
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
import FieldForm from "./form";
import FieldFilter from "./filter";

@Component({
  components: {
    FieldForm,
    FieldFilter,
  },
})
export default class System extends Vue {
  get fields() {
    const { rows, ...pagination } = this.$store.state.typeManger.fields;
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
      title: "领域名称",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "父级",
      dataIndex: "pname",
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
    this.handleSearch({});
  }
  handleSearchTop(params) {
    console.log(params)
    this.$store.commit('setfieldSearchName', params.name)
    console.log(this.$store.state.fieldSearchName)
    this.$store.dispatch("queryFieldList", params);
  }
  handleSearch(params) {
    if(this.$store.state.fieldSearchName.length == 0){
      this.$store.dispatch("queryFieldList", params);
    }else{
      this.$store.dispatch("queryFieldList", {name:this.$store.state.fieldSearchName ,...params});
    }
  }
  handleDelete(record) {
    this.$store.dispatch("delFieldList", record.id);
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
