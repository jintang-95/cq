<template>
  <a-list
    item-layout="vertical"
    size="large"
    class="list-box"
    :pagination="result.pagination"
    :data-source="result.rows"
  >
    <a-list-item
      :class="{
        topFirst: !isFavorite && item.ttop && result.pagination.current === 1,
        topNext: !isFavorite && item.ttop && result.pagination.current > 1,
      }"
      class="list-item"
      slot="renderItem"
      key="item.title"
      slot-scope="item, index"
    >
      <div style="display: flex" class="father">
        <img class="logo" :src="item.url" />
        <div style="width: 350px">
          <p
            @mouseenter="onMouseOver(0, index)"
            @mouseleave="onMouseout(0, index)"
            class="webListName"
            style="width: 237px;"
          >
            <a
              :href="item.websiteUrl"
              target="_blank"
              @click="() => handleSkip(item, item.twebsiteUsers[0])"
              v-if="item.twebsiteUsers.length <= 1"
            >
              {{ item.websiteName }}
            </a>
            <a-dropdown
              :trigger="['click']"
              placement="bottomCenter"
              v-if="item.twebsiteUsers.length > 1"
            >
              <span style="color: #1890ff; cursor: pointer">
                {{ item.websiteName }}
              </span>
              <a-menu slot="overlay">
                <a-menu-item
                  v-for="account in item.twebsiteUsers"
                  :key="account.id"
                >
                  <a
                    :href="item.websiteUrl"
                    target="_blank"
                    @click="() => handleSkip(item, account)"
                  >
                    {{ account.websiteUserName }}
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </p>
          <p>
            <i>接入时间：</i>
            {{ item.accessTime }}
          </p>
        </div>
        <div style="width: 200px; position: relative">
          <p>
            <i style="display: inline-block; text-indent: 28px">领域：</i>
            {{ item.fieldName }}
          </p>
          <p
            @mouseenter="onMouseOver(1, index)"
            @mouseleave="onMouseout(1, index)"
            class="webListName"
            style="cursor: pointer;"
          >
            <i>所属单位：</i>
            {{ item.accessDept }}
          </p>
          <div v-if="item.deptShow" class="deptShow">
            {{ item.accessDept }}
          </div>
        </div>
        <div v-if="item.show" class="son">{{ item.websiteName }}</div>
      </div>
      <!-- 分组管理 -->
      <div
        v-if="item.groupList.length > 0"
        style="position: relative; width: 125px"
      >
        <a-tag
          class="tag"
          color="blue"
          v-for="group in item.groupList.slice(0, 6)"
          :key="group.groupId"
          @mouseenter="onMouseOver(2, index)"
          @mouseleave="onMouseout(2, index)"
          style="cursor: pointer;"
        >
          {{ group.groupName || group.groupName }}
        </a-tag>
        <div v-if="item.groupShow" class="groupShow">
          <span v-for="group in item.groupList" :key="group.groupId">
            {{ group.groupName || group.groupName }}
          </span>
        </div>
      </div>
      <span class="move" v-if="isFavorite" @click="() => delFavorites(item)">
        <a-icon
          type="star"
          class="blue"
          :style="{ fontSize: '12px', color: '#08c' }"
        />
        取消收藏
      </span>
      <div class="top-icon-group" v-else>
        <span class="move">
          <a-dropdown v-model="item.visible">
            <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
              <a-icon
                type="switcher"
                :style="{ fontSize: '12px', color: '#08c' }"
              />
              添加组
            </a>
            <a-menu
              selectable
              :selectedKeys="item.groupName"
              slot="overlay"
              v-if="groups.rows.length"
            >
              <a-menu-item
                v-for="group in groups.rows"
                :key="group.groupId"
                :value="group.groupId"
              >
                <span @click="handleAddWebGroud(item, group.groupId)">
                  {{ group.groupName }}
                </span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <span
          class="move"
          v-if="item.isCollection"
          @click="() => delFavorites(item)"
        >
          <a-icon
            type="star"
            class="blue"
            :style="{ fontSize: '12px', color: '#08c' }"
          />
          取消收藏
        </span>
        <span v-else class="move" @click="() => addFavorites(item)">
          <a-icon
            type="star"
            class="blue"
            :style="{ fontSize: '12px', color: '#08c' }"
          />
          收藏
        </span>
        <span class="move" v-if="item.topTime" @click="() => delCreatTop(item)">
          <a-icon
            type="upload"
            class="blue"
            :style="{ fontSize: '12px', color: '#08c' }"
          />
          取消置顶
        </span>
        <span v-else class="move" @click="() => addCreatTop(item)">
          <a-icon
            type="upload"
            class="blue"
            :style="{ fontSize: '12px', color: '#08c' }"
          />
          置顶
        </span>
      </div>
      <!-- <button class="look">查看详情</button> -->
      <ViewDetail
        modalTitle="查看详情"
        :columns="detailColumns"
        :record="item"
        :buttonText="'查看详情'"
      />
    </a-list-item>
  </a-list>
</template>

<script lang="ts">
import fetchApi from "@/api";
import { Component, Prop, Vue } from "vue-property-decorator";
import ViewDetail from "./detail.vue";
function getHost(urlString: string): string {
  let index = urlString.indexOf("://");
  if (index !== -1) {
    urlString = urlString.substring(index + 3);
  }
  index = urlString.indexOf("/");
  if (index !== -1) {
    urlString = urlString.substring(0, index);
  }
  return urlString;
}

interface Group {
  groupId: number;
  groupName: string;
  isLock?: boolean;
}
interface WebItem {
  id: number;
  groupName: string[];
  groupList: string[];
}

interface Account {
  id: number;
  websiteUserName: string;
  websiteUserPassword: string;
}
interface Data {
  rows: WebItem[];
  pagination: {
    current: number;
  };
}
@Component({
  components: {
    ViewDetail,
  },
})
export default class WebList extends Vue {
  @Prop() isFavorite?: boolean;
  visible = false;
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
    // {
    //   title: "责任处室联系人电话",
    //   key: "accessDeptPhone",
    // },
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
  get groups() {
    return this.$store.state.groupsAll;
  }

  get result() {
    const data = this.isFavorite
      ? this.$store.state.favorites
      : this.$store.state.websites;
    const { rows, ...pagination } = data;
    return {
      rows,
      pagination: {
        ...pagination,
        onChange: (current: number) => {
          if (this.isFavorite) {
            this.$store.dispatch("queryFavorites", { current });
          } else {
            // console.log(this.$store.state.searchName.length)
            if (this.$store.state.searchName.length > 0) {
              this.$store.dispatch("queryWebsite", {
                current,
                websiteName: this.$store.state.searchName,
              });
            } else {
              this.$store.dispatch("queryWebsite", { current });
            }
          }
        },
      },
    };
  }
  created() {
    if (this.isFavorite) {
      this.$store.dispatch("queryFavorites");
    } else {
      this.$store.dispatch("queryWebsite");
    }
  }
  onMouseOver(i: number, n: any) {
    console.log(this.result.rows);
    if (i == 0) {
      this.$set(this.result.rows[n], "show", true);
    } else if (i == 1) {
      this.$set(this.result.rows[n], "deptShow", true);
    } else if (i == 2) {
      this.$set(this.result.rows[n], "groupShow", true);
    }
  }
  onMouseout(i: number, n: any) {
    if (i == 0) {
      this.$set(this.result.rows[n], "show", false);
    } else if (i == 1) {
      this.$set(this.result.rows[n], "deptShow", false);
    } else if (i == 2) {
      this.$set(this.result.rows[n], "groupShow", false);
    }
  }
  handleAddWebGroud(item: WebItem, groupId: any) {
    let groups: any[] = [];
    if (item.groupList.length > 0) {
      const list: any = item.groupList;
      groups = list?.map((i: any) => i?.groupId);
      console.log(groups);
      item.groupList.forEach((i: any) => {
        groups.push(i.groupId);
      });
    }
    if (groups.includes(groupId)) {
      groups = groups.filter((name) => name !== groupId);
      groups = [...new Set(groups)];
    } else {
      groups.push(groupId);
      groups = [...new Set(groups)];
    }
    this.$store.dispatch("addWebsiteGroupOne", {
      websiteId: [item.id],
      groupId: groups,
    });
  }
  // handleAddWebGroud(item: WebItem, { groupName }: { groupName: string }) {
  //   console.log(groupName);
  //   let groups = item.groupName || [];
  //   if (groups.includes(groupName)) {
  //     groups = groups.filter((name) => name !== groupName);
  //   } else {
  //     groups.push(groupName);
  //   }
  //   this.$store.dispatch("addWebsiteGroup", {
  //     websiteId: [item.id],
  //     groupName: groups,
  //   });
  // }
  addFavorites(item: WebItem) {
    this.$store.dispatch("addFavorites", item.id);
  }
  delFavorites(item: WebItem) {
    this.$store.dispatch("delFavorites", {
      id: item.id,
      isFavorite: this.isFavorite,
    });
  }
  addCreatTop(item: WebItem) {
    this.$store.dispatch("addWebsiteTop", item.id);
  }
  delCreatTop(item: WebItem) {
    this.$store.dispatch("delWebsiteTop", item.id);
  }
  handleSkip(item: { id: number; websiteUrl: string }, account: Account) {
    // 禁止iframe
    if (self !== top) {
      return;
    }
    fetchApi({
      method: "post",
      apiPath: `/log/addVisitLog/${item.id}`,
    });
    window.postMessage(
      {
        type: "__AutoSaveAccount__",
        key: getHost(item.websiteUrl),
        data: {
          username: account.websiteUserName,
          password: account.websiteUserPassword,
        },
      },
      "*"
    );
  }
}
</script>

<style>
.list-box .ant-empty-description {
  color: #fff;
}
</style>
<style scoped>
p {
  margin: 0;
}
.top-icon-group {
  display: flex;
  justify-content: flex-end;
  width: 300px;
  margin-left: 20px;
  color: #477ba1;
}
.move {
  display: flex;
  align-items: center;
  width: 100px;
  cursor: pointer;
}
.move i.anticon {
  margin-right: 4px;
}
.tag ~ .tag {
  margin-bottom: 5px;
}
.father {
  position: relative;
}
.son {
  position: absolute;
  background-color: white;
  bottom: -5px;
  left: 10%;
  padding: 5px 20px;
  z-index: 2;
}
.deptShow {
  position: absolute;
  background-color: white;
  top: 95%;
  left: 38%;
  padding: 5px 20px;
  z-index: 2;
}
.groupShow {
  position: absolute;
  background-color: white;
  top: 95%;
  padding: 5px 20px;
  z-index: 2;
}
.look {
  background-color: white;
  color: #1890ff;
  border: 1px solid #1890ff;
  outline: none;
  width: 80px;
  height: 35px;
  border-radius: 5px;
  cursor: pointer;
}
.list-box {
  width: 1250px;
  min-width: 800px;
  margin: 0 auto;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.list-box .list-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 800px;
  padding: 20px;
  padding-right: 80px;
  height: 116px;
  margin-bottom: 12px;
  background: #fff;
  text-align: left;
  color: #000;
}
.list-box .list-item:hover {
  background: rgba(237, 244, 255, 1);
}
.list-box .list-item .logo {
  width: 46px;
  height: 46px;
  margin-right: 20px;
}
.list-item > div > p:first-child {
  margin-bottom: 8px;
}
.list-item h3 {
  text-align: left;
}
.list-item p > span:first-child {
  margin-right: 60px;
}
.list-item i {
  font-style: normal;
  font-weight: bold;
  color: #000;
}
.webListName {
  overflow: hidden;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.topFirst::before,
.topNext::before {
  content: "";
  display: block;
  width: 36px;
  height: 36px;
  position: absolute;
  top: 0;
  left: 0;
}
.topFirst:nth-child(1):before {
  background: url(../assets/top0.png) no-repeat;
  background-size: 100%;
}
.topFirst:nth-child(2):before {
  background: url(../assets/top1.png) no-repeat;
  background-size: 100%;
}
.topFirst::before {
  background: url(../assets/top2.png) no-repeat;
  background-size: 100%;
}
.topNext::before {
  background: url(../assets/top2.png) no-repeat;
  background-size: 100%;
}
</style>
