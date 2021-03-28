<template>
  <div class="favorites-page">
    <WebList :isFavorite="true" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import WebList from "@/components/list.vue";

@Component({
  components: {
    WebList,
  },
})
export default class Favorites extends Vue {}
</script>

<style scoped>
.favorites-page {
  width: 100%;
  padding-top: 30px;
  min-height: calc(100vh - 68px);
  background: linear-gradient(180deg, #000000 0%, #0d121f 100%);
}
</style>
