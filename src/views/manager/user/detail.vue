<template>
  <a-button :ghost="buttonGhost" @click="showModal">
    {{ buttonText || "查看" }}
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :bodyStyle="bodyStyle"
      @cancel="handleCancel"
    >
      <a-row
        v-for="item in columns"
        :key="item.key"
        style="padding-bottom: 10px;"
      >
        <a-col :span="10" style="padding-right: 10px;">
          {{ item.title }}
        </a-col>
        <a-col :span="14">
          {{ detail[item.key] }}
        </a-col>
      </a-row>
      <a-button slot="footer" @click="handleCancel">关闭</a-button>
    </a-modal>
  </a-button>
</template>
<script>
import fetchApi from "@/api/index";
export default {
  name: "ViewDetail",
  props: {
    columns: {
      type: Array,
      required: true,
    },
    modalTitle: {
      type: String,
      required: false,
    },
    buttonText: {
      type: String,
      required: false,
    },
    buttonGhost: {
      type: Boolean,
      required: false,
    },
    record: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      visible: false,
      detail: [],
      bodyStyle: {
        maxHeight: "70vh",
        overflow: "scroll",
      },
    };
  },
  methods: {
    showModal() {
      fetchApi({
        apiPath: "/tsysuser/select/" + this.record.userId,
      }).then((res) => {
        this.detail = res.data;
        this.visible = true;
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
