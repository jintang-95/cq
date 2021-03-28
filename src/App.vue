<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <Header v-show="showHeader" :userName="userName" :isAdmin="isAdmin" />
      <div :class="{ 'main-content': showHeader }">
        <router-view></router-view>
      </div>
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { Component, Vue, Watch } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import { getUserInfo } from "@/util";

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  locale = zhCN;
  showHeader!: boolean;
  userName!: string;
  isAdmin!: boolean;

  @Watch("$route.meta.hideHeader", { immediate: true })
  private onRouteMetaChange(hideHeader: boolean) {
    const { userName, isAdmin } = getUserInfo();
    this.showHeader = !hideHeader;
    this.userName = userName;
    this.isAdmin = isAdmin;
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

.main-content {
  padding-top: 68px;
}
</style>
