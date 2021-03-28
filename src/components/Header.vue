<template>
  <div class="header">
    <div class="header-left">
      <img src="../assets/logo-text.png" @click="goToIntdex" />
    </div>
    <div class="header-right">
      <div class="collect" @click="goToFavorites">
        <img src="../assets/collect.png" />
        收藏夹
      </div>
      <a-dropdown :trigger="['hover']" placement="bottomCenter">
        <div class="user-info" @click="(e) => e.preventDefault()">
          <a-avatar icon="user" />
          <span>{{ userName }}</span>
        </div>
        <a-menu slot="overlay">
          <a-menu-item key="manager" @click="gotoManager" v-if="isAdmin">
            平台管理
          </a-menu-item>
          <a-menu-item key="logout" @click="logout">
            退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { setUserInfo } from "@/util";
import fetchApi from "@/api/index";

@Component
export default class Header extends Vue {
  @Prop() userName!: string;
  @Prop() isAdmin!: boolean;

  goToIntdex() {
    if (this.$route.path !== "/") {
      this.$router.push("/");
    }
  }
  goToFavorites() {
    if (this.$route.path !== "/favorites") {
      this.$router.push("/favorites");
    }
  }
  gotoManager() {
    if (this.$route.path !== "/manager/system") {
      this.$router.push("/manager/system");
    }
  }
  logout() {
    fetchApi({
      apiPath: `/tsysuser/logout`,
    }).then(() => {
      setUserInfo(null);
      this.$message.success("退出登录");
      this.$router.replace("/login");
    });
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  z-index: 9;
  display: flex;
  width: 100%;
  height: 68px;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  font-size: 14px;
  background: rgba(13, 18, 31, 1);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}
.header-left img {
  height: 40px;
  cursor: pointer;
}

.collect {
  display: flex;
  align-content: center;
  margin-right: 50px;
  color: #fff;
  cursor: pointer;
  user-select: none;
}
.collect:hover {
  opacity: 0.8;
}
.collect img {
  height: 20px;
  margin-right: 5px;
}

.user-info {
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.user-info > span {
  margin-right: 10px;
}
</style>
