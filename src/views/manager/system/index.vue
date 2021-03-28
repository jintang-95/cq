<template>
  <div class="system-page">
    <div class="filter-box">
      <SystemFilter @search="handleSearchTop" />
      <div class="filter-right">
        <a-button type="text" :href="downloadPath" download="接入场景应用模版">
          下载模版
        </a-button>
        <a-upload
          name="file"
          accept=".xls,.xlsx,.xlsm"
          :multiple="false"
          :showUploadList="false"
          :action="uploadPath"
          :headers="headers"
          @change="handleUploadChange"
        >
          <a-button type="primary">
            导入
          </a-button>
        </a-upload>
        <SystemForm :addOrEdit="true" modalTitle="新增网站" />
      </div>
    </div>
    <a-table
      rowKey="id"
      :columns="tableColumns"
      :data-source="websites.rows"
      :pagination="websites.pagination"
      @change="handleSearch"
    >
      <div class="table-ellipsis" slot="ellipsis" slot-scope="value">
        <a-tooltip placement="top" :title="value">
          {{ value }}
        </a-tooltip>
      </div>
      <span class="table-actions" slot="action" slot-scope="record">
        <ViewDetail
          modalTitle="查看详情"
          :columns="detailColumns"
          :record="record"
        />
        <SystemForm
          buttonText="编辑"
          modalTitle="编辑网站"
          :buttonGhost="true"
          :addOrEdit="false"
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
import { getUserInfo } from "@/util";
import baseUrl from "@/api/baseUrl";

import SystemForm from "./form";
import SystemFilter from "./filter";
import ViewDetail from "../detail";

@Component({
  components: {
    SystemForm,
    SystemFilter,
    ViewDetail,
  },
})
export default class System extends Vue {
  get websites() {
    const { rows, ...pagination } = this.$store.state.websites;
    console.log(rows);
    return {
      rows,
      pagination,
    };
  }
  get downloadPath() {
    return `http://106.13.186.157:8008/excel/download/excel.xlsx`;
  }
  get uploadPath() {
    return `${baseUrl}/websiteinfo/import`;
  }
  get headers() {
    return {
      UserId: getUserInfo().userId,
    };
  }

  tableColumns = [
    {
      title: "序号",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "业务系统或支撑应用名称",
      dataIndex: "websiteName",
      ellipsis: true,
    },
    {
      title: "场景",
      dataIndex: "sceneName",
      ellipsis: true,
    },
    {
      title: "接入类型",
      dataIndex: "accessType",
      width: 100,
      ellipsis: true,
    },
    {
      title: "领域",
      dataIndex: "fieldName",
      width: 100,
      ellipsis: true,
    },
    {
      title: "访问地址",
      dataIndex: "websiteUrl",
      ellipsis: true,
      scopedSlots: { customRender: "ellipsis" },
    },
    {
      title: "操作",
      key: "action",
      width: 240,
      scopedSlots: { customRender: "action" },
    },
  ];

  detailColumns = [
    {
      title: "模块",
      key: "moduleType",
    },
    {
      title: "场景名称",
      key: "sceneName",
    },
    {
      title: "业务系统或支撑应用名称",
      key: "websiteName",
    },
    {
      title: "领域",
      key: "fieldName",
    },
    {
      title: "接入类型",
      key: "accessType",
    },
    // {
    //   title: "接入状态",
    //   key: "commentary",
    // },
    {
      title: "网络接入类型",
      key: "websitesType",
    },
    {
      title: "关注度",
      key: "attention",
    },
    // {
    //   title: "任务批次",
    //   key: "taskBatches",
    // },
    {
      title: "登录地址",
      key: "websiteUrl",
    },
    {
      title: "接入时间",
      key: "accessTime",
    },
    {
      title: "接入单位",
      key: "accessDept",
    },
    // {
    //   title: "属性",
    //   key: "attribute",
    // },
    {
      title: "责任处室联系人",
      key: "responseContactor",
    },
    {
      title: "责任处室联系人电话",
      key: "responsePhone",
    },
    {
      title: "场景核对数字重庆公司分工",
      key: "sceneCheckDivision;",
    },
    {
      title: "场景核对数字重庆公司分工联系人电话",
      key: "sceneCheckDivisionPhone",
    },
    {
      title: "是否提供解说词",
      key: "commentary",
    },
    {
      title: "解说词分工",
      key: "commentaryDivisionScript",
    },
    {
      title: "解说词脚本分工联系人电话",
      key: "commentaryDivisionPhone",
    },
    {
      title: "接入单位",
      key: "attribute",
    },
    {
      title: "接入单位联系人",
      key: "accessDeptContactor",
    },
    {
      title: "接入单位联系人电话",
      key: "accessDeptPhone",
    },
    {
      title: "预排名",
      key: "preliminaryRank",
    },
    {
      title: "备注",
      key: "remark",
    },
  ];

  created() {
    this.$store.dispatch("queryWebsite");
  }
  handleSearchTop(params) {
    console.log(params);
    this.$store.commit("setsystemName", params.websiteName);
    this.$store.commit("setsceneSearchName", params.sceneName);
    this.$store.commit("setfieldSearch", params.field);
    console.log(this.$store.state.systemName + "searchName");
    console.log(this.$store.state.sceneSearchName + "searchName");
    console.log(this.$store.state.fieldSearch + "searchName");
    this.$store.dispatch("queryWebsiteSys", params);
  }
  handleSearch(params) {
    console.log(this.$store.state.systemName);
    if (
      this.$store.state.systemName.length == 0 &&
      this.$store.state.sceneSearchName.length == 0 &&
      this.$store.state.fieldSearch.length == 0
    ) {
      this.$store.dispatch("queryWebsiteSys", params);
    } else {
      this.$store.dispatch("queryWebsiteSys", {
        websiteName: this.$store.state.systemName,
        sceneName: this.$store.state.sceneSearchName,
        field: this.$store.state.fieldSearch,
        ...params,
      });
    }
  }
  handleDelete(record) {
    this.$store.dispatch("delWebsite", record.id);
  }
  handleUploadChange(info) {
    if (info.file?.response.status !== 200) {
      this.$message.error(info.file.response.msg);
    } else if (info.file.status === "done") {
      this.$message.success(`${info.file.name} 上传成功`);
      this.$store.dispatch("queryWebsite");
    } else if (info.file.status === "error") {
      this.$message.error(`${info.file.name} 上传失败`);
    }
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
  align-items: center;
  padding-bottom: 20px;
}
.filter-right {
  display: flex;
  align-items: center;
}
.filter-right span {
  margin: 0 10px;
}

.table-actions button:not(:first-child) {
  margin-left: 10px;
}
.table-ellipsis span {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
</style>
