<template>
  <div class="manager-page">
    <a-menu
      class="manager-menu"
      :default-open-keys="['web']"
      :selectedKeys="selectedKeys"
      @click="handleClick"
      mode="inline"
      theme="dark"
    >
      <a-sub-menu key="web">
        <span @click="() => handleSkip('/manager/system')" slot="title">
          系统管理
        </span>
        <a-menu-item key="system">
          <div @click="() => handleSkip('/manager/system')">
            已接入系统
          </div>
        </a-menu-item>
        <a-menu-item key="user">
          <div @click="() => handleSkip('/manager/user')">
            用户管理
          </div>
        </a-menu-item>
        <a-menu-item key="role">
          <div @click="() => handleSkip('/manager/role')">
            角色管理
          </div>
        </a-menu-item>
        <a-menu-item key="field">
          <div @click="() => handleSkip('/manager/field')">
            领域管理
          </div>
        </a-menu-item>
        <a-menu-item key="logs">
          <div @click="() => handleSkip('/manager/logs')">
            网站排行
          </div>
        </a-menu-item>
        <a-menu-item key="monitor">
          <div @click="() => handleSkip('/manager/monitor')">
            监控查询
          </div>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedKeys: ["system"],
    };
  },
  beforeMount() {
    this.selectedKeys = [this.$route.name.toLowerCase()];
  },
  methods: {
    handleSkip(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    handleClick(e) {
      this.selectedKeys = [e.key];
    },
  },
  watch: {
    $route: function(cur) {
      this.selectedKeys = [cur.name.toLowerCase()];
    },
  },
};
</script>

<style scoped>
.manager-page {
  display: flex;
  position: relative;
  padding-left: 200px;
}

.manager-menu {
  width: 200px;
  position: fixed;
  left: 0;
  top: 68px;
  bottom: 0;
  overflow: scroll;
  z-index: 9;
}
</style>
