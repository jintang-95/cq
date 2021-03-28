<template>
  <div class="home">
    <div class="content-search">
      <img class="mb-12" src="../assets/computer.png" />
      <span class="mb-12">共收录 {{ totalWebsite || totalData }} 款应用</span>
      <div class="mb-12 search-input-btn">
        <a-input
          :maxLength="50"
          type="text"
          placeholder="查询应用"
          v-model="websiteName"
          allowClear
        />
        <a-button type="primary" @click="queryList">查询</a-button>
      </div>
      <ul class="search-menu menu-l">
        <li @click="setField({})">
          <span :class="[currentField.value ? 'Tag' : 'activeTag']">
            全部
          </span>
        </li>
        <li v-for="item in fields" :key="item.value">
          <a-dropdown v-if="item && item.length">
            <span class="ant-dropdown-link" @click="setField(item)">
              {{ item.label }}
              <a-icon type="down" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item
                v-for="child in item.children"
                :key="child.value"
                @click="setField(child)"
              >
                <span
                  :class="[
                    child.value == currentField.value ? 'activeTag' : 'Tag',
                  ]"
                >
                  {{ child.label }}
                </span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <span
            :class="[item.value == currentField.value ? 'activeTag' : 'Tag']"
            @click="setField(item)"
          >
            {{ item.label }}
          </span>
        </li>
      </ul>
      <ul class="search-menu menu-z">
        <li @click="setGroup({})">
          <span :class="[currentGroup.groupId ? 'Tag' : 'activeTag']">
            全部
          </span>
        </li>
        <li
          v-for="group in groupsAll"
          :key="group.groupId"
          @click="setGroup(group)"
        >
          <span
            :class="[
              group.groupId === currentGroup.groupId ? 'activeTag' : 'Tag',
            ]"
          >
            {{ group.groupName }}
          </span>
        </li>
        <li @click="showCreateGroupModal">
          <a-icon type="plus-circle" />
          分组管理
        </li>
        <li>
          <BatchGroup />
        </li>
      </ul>
    </div>
    <WebList />
    <a-modal
      v-model="createGroupModalVisible"
      title="分组管理"
      :footer="null"
      :width="720"
    >
      <a-form :form="form" layout="inline" @submit="handleSubmit">
        <a-form-item label="创建分组">
          <a-input
            :maxLength="50"
            v-decorator="[
              'groupName',
              {
                rules: [{ required: true, message: '分组名称不能为空!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary">创建</a-button>
        </a-form-item>
      </a-form>
      <div style="margin-top: 20px"></div>
      <a-table
        rowKey="groupId"
        size="small"
        :columns="columns"
        :data-source="groups.rows"
        :pagination="groups.pagination"
        @change="handleSearchGroupsPage"
      >
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
            <span slot="action">
              <a-button @click="() => handleShowEditGroup(record)">
                编辑
              </a-button>
              <a-divider type="vertical" />
              <a-popconfirm
                title="是否确认删除？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="() => handleDeleteGroup(record)"
              >
                <a-button>删除</a-button>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </a-modal>
    <a-modal
      title="修改分组"
      :visible="editGroupvisible"
      okText="保存"
      cancelText="取消"
      @ok="handleEditGroupOk"
      @cancel="handleEditGroupCancel"
    >
      <a-input
        :maxLength="50"
        v-if="curChangeGroup"
        v-model="curChangeGroup.groupName"
        placeholder="请输入组名"
      ></a-input>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import WebList from "@/components/WebList.vue";
import BatchGroup from "@/components/BatchGroup.vue";
import fetchApi from "@/api";

interface Option {
  label?: string;
  value?: string;
  children?: Option[];
}

interface Group {
  groupId?: number;
  groupName?: string;
  isLock?: boolean;
}

interface ListItem {
  id: number;
  url: string;
  //所属系统
  manager: string;
  //接入时间
  accessTime: string;
  //所属平台
  affiliation: string;
  //用户组
  group: Group;
  //是否收藏
  isFavorites: boolean;
  //是否置顶-时间
  creatTop: number;
  //类型
  type: string;
  field: string;
  account: string;
  webUrl: string;
  accounts: Option[];
}

@Component({
  components: {
    WebList,
    BatchGroup,
  },
})
export default class Header extends Vue {
  websiteName = "";
  totalWebsite = 0;
  curChangeGroup: Group | null = null;
  currentField: Option = {};
  currentGroup: Group = {};
  editGroupvisible = false;
  createGroupModalVisible = false;
  columns = [
    {
      title: "序号",
      dataIndex: "groupId",
    },
    {
      title: "组名",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      scopedSlots: { customRender: "action" },
    },
  ];

  get totalData(): number {
    const total = this.$store.state.websites?.total;
    if (!this.totalWebsite) {
      this.totalWebsite = total;
    }
    return total;
  }
  get fields() {
    return this.$store.state.fields;
  }
  get groups() {
    const { rows, ...pagination } = this.$store.state.groups;
    console.log(rows, pagination);
    return {
      rows,
      pagination,
    };
  }
  get groupsAll() {
    return this.$store.state.groupsAll.rows;
  }

  /* eslint-disable-next-line */
  form: any;
  created() {
    this.$store.dispatch("queryFieldTree");
    this.$store.dispatch("queryGroupAll");
    this.form = this.$form.createForm(this, { name: "coordinated" });
    this.$store.dispatch("queryGroup");
  }

  handleSearchGroupsPage(params: { current: number }) {
    this.$store.dispatch("queryGroup", params);
  }
  queryList() {
    this.$store.commit("setsearchName", this.websiteName);
    console.log(this.$store.state.searchName + "searchName");
    this.$store.dispatch("queryWebsite", {
      websiteName: this.websiteName,
      groupName: this.currentGroup?.groupId,
      field: this.currentField?.label,
    });
  }
  setField(field: Option) {
    this.currentField = field;
    this.queryList();
  }
  setGroup(group: Group) {
    this.currentGroup = group;
    this.queryList();
  }

  showCreateGroupModal() {
    this.$store.dispatch("queryGroup");
    this.createGroupModalVisible = true;
  }
  handleSubmit(e: MouseEvent) {
    e.preventDefault();
    this.form.validateFields((err: unknown, values: { grouptName: string }) => {
      if (!err) {
        this.$store.dispatch("addGroup", values);
      }
    });
  }
  handleShowEditGroup(item: Group) {
    this.curChangeGroup = { ...item };
    this.editGroupvisible = true;
  }
  handleEditGroupOk() {
    if (!this.curChangeGroup?.groupName) {
      this.$message.warn("请输入组名");
      return;
    }
    fetchApi({
      method: "put",
      apiPath: "/baseGroup/updateWebsiteGroupUser",
      params: { ...this.curChangeGroup },
    }).then(() => {
      this.curChangeGroup = null;
      this.editGroupvisible = false;
      this.$message.success("修改成功");
      this.$store.dispatch("queryGroup");
    });
  }
  handleEditGroupCancel() {
    this.curChangeGroup = null;
    this.editGroupvisible = false;
  }
  handleDeleteGroup(record: { groupId: number }) {
    this.$store.dispatch("delGroup", record.groupId);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ant-dropdown-menu {
  background: rgba(54, 55, 57, 0.8);
}
.ant-dropdown-menu-item span,
.ant-dropdown-link,
.ant-dropdown-menu a {
  color: #fff;
}
.ant-dropdown-menu-item:hover,
.ant-dropdown-menu-submenu-title:hover {
  background: #3fabff;
}

.activeTag {
  color: #3fabff;
}
.Tag {
  color: #fff;
}
.warper {
  position: relative;
  border-radius: 2px;
}
.warper .ant-dropdown-link {
  position: relative;
  color: #477ba1;
}
.top0::before,
.top1::before,
.top2::before {
  content: "";
  display: block;
  width: 36px;
  height: 36px;
  position: absolute;
  top: 0;
  left: 0;
}
.top0::before {
  background: url(../assets/top0.png) no-repeat;
  background-size: 100%;
}
.top1::before {
  background: url(../assets/top1.png) no-repeat;
  background-size: 100%;
}
.top2::before {
  background: url(../assets/top2.png) no-repeat;
  background-size: 100%;
}
.mb-12 {
  margin-bottom: 12px;
}
h3,
p {
  margin: 0;
}
.top-icon-group {
  display: flex;
  justify-content: flex-end;
  margin-left: 20px;
  color: #477ba1;
}
.move {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 24px;
}
.move.fix-width {
  width: 80px;
}
.move i.anticon {
  margin-right: 4px;
}

.top-icon-group span:last-child {
  margin-right: 0;
}

.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(100vh - 68px);
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #fff;
  background-position: top center;
  background-size: 100%;
  box-sizing: border-box;
  background: linear-gradient(to bottom, #012c34 0%, #0d121f 100%);
}
.content-search {
  display: flex;
  padding: 20px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.content-search img {
  width: 90px;
  height: 90px;
}
.search-input-btn {
  display: flex;
  justify-content: center;
}
.search-input-btn .ant-input-affix-wrapper {
  width: 400px;
}
.search-input-btn .ant-btn {
  margin-left: 10px;
}
.search-menu {
  align-self: flex-start;
  display: flex;
  flex-wrap: wrap;
  max-width: 80vw;
  padding: 0 0 0 10px;
  margin: 0;
  list-style: none;
}
.menu-l {
  margin: 0 0 12px 0;
}
.menu-l::before {
  display: inline-block;
  padding: 2px 6px;
  content: "领域:";
  margin-right: 12px;
  background: linear-gradient(180deg, #58cfff 0%, rgba(88, 207, 255, 0) 100%);
}
.menu-z::before {
  display: inline-block;
  padding: 2px 6px;
  content: "组别:";
  margin-right: 12px;
  background: linear-gradient(180deg, #337aff 0%, rgba(51, 63, 255, 0) 100%);
}
.search-menu li {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}
.search-menu li.active {
  color: cornflowerblue;
}
.content-main {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px 0 0 0;
  box-sizing: border-box;
}
.content-main ul {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  min-width: 1000px;
  list-style: none;
}
.content-main ul li {
  display: flex;
  align-items: center;
  padding: 20px;
  height: 116px;
  margin-bottom: 12px;
  background: #fff;
}
.content-main ul li:hover {
  background: rgba(237, 244, 255, 1);
}
.content-main ul li .logo {
  width: 46px;
  height: 46px;
  margin-right: 16px;
}

.content-main-right {
  display: flex;
  align-items: center;
  text-align: left;
  color: #000;
}
.content-main-right > div > p:first-child {
  margin-bottom: 8px;
}
.content-main-right h3 {
  text-align: left;
}
.content-main-right p > span:first-child {
  margin-right: 60px;
}

.content-main-right i {
  font-style: normal;
  font-weight: bold;
  color: #000;
}
.page-nation {
  display: flex;
  min-width: 800px;
  padding-bottom: 20px;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}
.page-nation ul {
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
}
.page-nation ul li {
  padding: 0.5em 1em;
  margin-right: 12px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.page-nation select {
  height: calc(3em - 4px);
  background: linear-gradient(180deg, #000000 0%, #0d121f 100%);
}
.page-nation .active {
  color: #61b1ff;
  border: 1px solid #61b1ff;
}
</style>
