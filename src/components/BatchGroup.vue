<template>
  <a-button type="link" ghost @click="showModal">
    批量分组
    <a-modal
      :visible="visible"
      :confirm-loading="confirmLoading"
      :bodyStyle="bodyStyle"
      :width="700"
      @ok="handleOk"
      @cancel="handleCancel"
      title="批量分组"
      okText="确定"
      cancelText="取消"
    >
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="组别">
          <a-select
            :options="groupOptions"
            v-decorator="[
              'groupId',
              { rules: [{ required: true, message: '请选择组别' }] },
            ]"
            show-search
            placeholder="请选择组别"
            @select="selectChange(groupOptions)"
          ></a-select>
        </a-form-item>
        <a-form-item label="平台">
          <a-input-search @search="handleSearchList" placeholder="请输入平台" />
        </a-form-item>
        <a-form-item label="选择分组平台">
          <a-tree checkable v-model="checkedKeys" :tree-data="websitesAll" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-button>
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import fetchApi from "@/api/index";
import { getUserInfo } from "@/util";

@Component
export default class BatchGroup extends Vue {
  checkedItems = [];
  visible = false;
  confirmLoading = false;
  checkedKeys = [];
  bodyStyle = {
    maxHeight: "70vh",
    overflow: "scroll",
  };

  get groupOptions() {
    return this.$store.state.groupsAll.rows.map((item) => ({
      label: item.groupName,
      value: item.groupId,
    }));
  }
  get websitesAll() {
    const keys = this.checkedItems.map((item) => item.key);
    console.log("this.checkedItems", this.checkedItems);
    console.log("keys", keys);
    console.log("this.$store.state.websitesAll", this.$store.state.websitesAll);
    return [
      ...this.checkedItems,
      ...this.$store.state.websitesAll
        .filter((item) => !keys.includes(item.id))
        .map((item) => ({
          title: item.websiteName,
          key: item.id,
        })),
    ];
  }

  /* eslint-disable-next-line */
  form;
  created() {
    this.form = this.$form.createForm(this, { name: "batch-group" });
  }

  showModal() {
    this.visible = true;
    this.handleSearchList();
  }
  handleSearchList(value) {
    this.checkedItems = this.websitesAll.filter((item) =>
      this.checkedKeys.includes(item.key)
    );
    console.log(value);
    this.$store.dispatch("queryWebsiteAll", { websiteName: value });
  }

  handleCheck(keys) {
    this.checkedKeys = keys;
  }
  selectChange(value) {
    this.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.log(values.groupId);

      // if (!this.checkedKeys.length) {
      //   return this.$message.warn("请选择分组平台");
      // }
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/baseGroup/WebsiteIdByGroupId/" + values.groupId,
      }).then((res) => {
        this.checkedKeys = res.data;
      });
      //   .finally(() => {
      //     this.confirmLoading = false;
      //   });
    });
  }
  handleOk() {
    this.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if (!this.checkedKeys.length) {
        return this.$message.warn("请选择分组平台");
      }
      const { userId } = getUserInfo();
      fetchApi({
        apiPath: "/baseGroup/putWebsiteGroupById",
        params: {
          userId,
          websiteId: this.checkedKeys.join(","),
          groupId: values.groupId,
        },
      })
        .then(() => {
          this.visible = false;
          this.$message.success("批量添加分组成功");
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    });
  }
  handleCancel() {
    this.visible = false;
  }
}
</script>
