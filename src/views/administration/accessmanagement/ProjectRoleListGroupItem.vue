<template>
  <b-list-group-item class="flex-column align-items-start">
    <div class="d-flex justify-content-between">
      <span class="text-monospace">{{ projectRole.role.name }}</span>
      <div class="d-flex">
        <b-button
          size="sm"
          class="action-icon"
          v-b-tooltip.hover
          :title="$t('admin.edit_role')"
        >
          <span class="fa fa-edit"></span>
        </b-button>
        <b-button
          size="sm"
          class="action-icon ml-3"
          v-on:click="$emit('removeClicked')"
          v-b-tooltip.hover
          :title="$t('admin.remove_role')"
        >
          <span class="fa fa-trash-o"></span>
        </b-button>
      </div>
    </div>
    <p class="mt-2 font-weight-light">{{ projectRole.project.name }}</p>
  </b-list-group-item>
</template>

<script>
export default {
  props: {
    projectRole: null,
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  margin-bottom: 0; /* Remove extra space at the bottom */
  padding-bottom: 0; /* Adjust padding for better spacing */
}

.list-group-item .form-group {
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.action-icon {
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;
}

.action-icon .fa {
  font-size: 1.2rem;
}

.action-icon .fa-edit {
  color: var(--secondary);
}

.action-icon .fa-trash-o {
  color: var(--danger);
}

.list-group-item:last-child {
  margin-bottom: -1px;
}
</style>
