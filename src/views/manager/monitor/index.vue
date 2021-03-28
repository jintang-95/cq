<template>
  <div class="monitor-page">
    <iframe :src="iframeUrl" :height="iframeHeight" scrolling="no" />
  </div>
</template>
<script>
import { Vue } from "vue-property-decorator";

export default class Monitor extends Vue {
  get iframeUrl() {
    const monitorPath = "http://www.demo-monitor.com";
    const appKey = "";
    if (appKey) {
      return `${monitorPath}/#/sys/${appKey}/index`;
    } else {
      return `https://server.raypaas.com/frontm/#/sys/5ff1cad0503430001f2de181/index`;
    }
  }
  get iframeHeight() {
    return window?.screen?.availHeight || "100%";
  }
}
</script>

<style scoped>
.monitor-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.monitor-page iframe {
  border: none;
  width: 100%;
}
</style>
