<template>
  <b-list-group>
    <b-list-group-item
      v-for="(item, index) in orderedItems()"
      :key="item.timestamp + item.title"
      class="flex-column align-items-start"
      style="background-color: rgb(28, 41, 55)"
    >
      <div :class="`item-head ${bootstrapVariant()}`" />
      <div v-if="index !== itemsCount() - 1" class="item-tail" />

      <b-spinner
        v-if="item.spinner"
        :variant="bootstrapVariant()"
        type="grow"
        class="ml-4"
      />

      <div v-if="!item.spinner" class="item-content">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            {{ item.title }}
          </h5>
          <small class="mt-2"> {{ formatTimestamp(item.timestamp) }}</small>
        </div>

        <small class="mb-1 item-description">
          <slot :item="item" name="item">
            {{ item.content || '' }}
          </slot>
        </small>
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import { BListGroup, BListGroupItem, BSpinner } from 'bootstrap-vue';
import common from '@/shared/common';

export default {
  props: {
    items: Array,
    loading: Boolean,
    dateFormat: String,
    variant: String,
  },
  components: { BListGroup, BListGroupItem, BSpinner },
  methods: {
    bootstrapVariant() {
      return this.variant || 'primary';
    },
    orderedItems() {
      let items = this.items;
      if (this.loading) {
        items = [
          ...items,
          { spinner: true, timestamp: 'time', title: 'loading' },
        ];
      }

      return items;
    },
    itemsCount() {
      if (this.loading) {
        return this.items.length + 1;
      }

      return this.items.length;
    },
    formatTimestamp(timestamp) {
      return common.formatTimestamp(timestamp, true);
    },
  },
};
</script>

<style scoped>
.list-group-item {
  position: relative;
  border: none;
  margin: 0;
  padding: 0 0 20px;
  box-sizing: border-box;
}

.item-head {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #20a8d8;
  border-radius: 100px;
  background-color: #20a8d8;
}

.item-tail {
  position: absolute;
  top: 10px;
  left: 4px;
  height: calc(100% - 10px);
  border-left: 2px dotted #e8e8e8;
}

.item-content {
  position: relative;
  top: -6px;
  margin: 0 0 0 18px;
  word-break: break-word;
}

.item-description {
  display: block;
  text-align: left;
}
</style>
