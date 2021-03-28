<template>
  <a-list
    item-layout="vertical"
    size="large"
    class="list-box"
    :pagination="result.pagination"
    :data-source="result.rows"
  >
    <a-list-item
      class="list-item"
      slot="renderItem"
      key="item.title"
      slot-scope="item"
    >
      <div style="display:flex;">
        <img class="logo" :src="item.url" />
        <div style="width:350px;">
          <p>
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
              <span style="color: #1890ff;cursor: pointer;">
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
            {{ item.createTime }}
          </p>
        </div>
        <div style="width:200px">
          <p>
            <i style="display: inline-block;text-indent: 28px;">
              领域：
            </i>
            {{ item.fieldName }}
          </p>
          <p>
            <i>所属单位：</i>
            {{ item.accessDept }}
          </p>
        </div>
      </div>

      <div v-if="item.groupName">
        <a-tag
          class="tag"
          color="blue"
          v-for="group in item.groupName"
          :key="group"
        >
          {{ group }}
        </a-tag>
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
                :key="group.groupName"
                :value="group.groupName"
              >
                <span @click="handleAddWebGroud(item, group)">
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
    </a-list-item>
  </a-list>
</template>

<script lang="ts">
import fetchApi from "@/api";
import { Component, Prop, Vue } from "vue-property-decorator";

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

interface WebItem {
  id: number;
  groupName: string[];
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

@Component
export default class WebList extends Vue {
  @Prop() isFavorite?: boolean;

  visible = false;
  get groups() {
    return this.$store.state.groups;
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
            this.$store.dispatch("queryWebsite", { current });
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
  handleAddWebGroud(item: WebItem, { groupName }: { groupName: string }) {
    let groups = item.groupName || [];
    if (groups.includes(groupName)) {
      groups = groups.filter((name) => name !== groupName);
    } else {
      groups.push(groupName);
    }
    this.$store.dispatch("addWebsiteGroup", {
      websiteId: item.id,
      groupName: groups,
    });
  }
  addFavorites(item: WebItem) {
    this.$store.dispatch("addFavorites", item.id);
  }
  delFavorites(item: WebItem) {
    this.$store.dispatch("delFavoritesOne", item.id);
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

.list-box {
  width: 1200px;
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
