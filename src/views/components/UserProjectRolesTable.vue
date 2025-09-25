<!-- Table containing the users participating project and their respective roles -->
<template>
  <div>
    <div class="mb-3">
      <b-table
        :busy="!projectRolesCurrent"
        :items="projectRolesCurrent"
        :fields="fields"
        :per-page="perPage === 0 ? rows : perPage"
        :current-page="currentPage"
        :filter="mergedTableOptions.tableFilter ?? localTableFilter"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong class="ml-2">{{ $t('message.loading') }}...</strong>
          </div>
        </template>

        <template #head(project)="data">
          <div class="w-100 d-flex justify-content-start align-items-center">
            {{ data.label }}
          </div>
        </template>

        <template v-if="shouldRenderInlineSearch" #head(role)="data">
          <div
            class="w-100 d-flex justify-content-between align-items-center"
            style="gap: 0.625rem"
          >
            <div class="h-100">{{ data.label }}</div>
            <b-form-input
              class="w-50 ml-auto"
              :placeholder="$t('message.search')"
              v-model="localTableFilter"
              :disabled="!!mergedTableOptions.tableFilter"
            ></b-form-input>

            <span class="action-icon" style="visibility: hidden"
              ><span class="fa fa-trash-o"></span
            ></span>
          </div>
        </template>

        <!-- Project Column -->
        <template #cell(project)="data">
          <div
            v-b-tooltip.hover
            :title="data.item.project.name"
            class="text-ellipsis"
          >
            {{ data.item.project.name }}
          </div>
        </template>

        <!-- Role column  -->
        <template #cell(role)="data">
          <div
            class="d-flex justify-content-between align-items-center"
            style="gap: 0.625rem"
          >
            <multiselect
              v-if="availableRoles"
              v-model="data.item.role"
              :options="availableRoles"
              :id="data.index"
              :allow-empty="false"
              @input="(selectedRole) => onRoleSelection(data, selectedRole)"
              :deselect-label="$t('admin.multiselect_remove_role')"
              :placeholder="$t('admin.select_role')"
              :open-direction="isLastRow(data.index, false) ? 'top' : 'auto'"
              :disabled="data.item.disabled"
              :loading="data.item.loading"
              label="name"
              track-by="uuid"
              class="multiselect"
            ></multiselect>
            <b-spinner v-else small variant="primary"></b-spinner>
            <b-button
              small
              class="action-icon"
              @click="onRemoveProjectRole(data)"
              v-b-tooltip.hover
              :title="$t('admin.remove_role')"
            >
              <span class="fa fa-trash-o"></span>
            </b-button>
          </div>
        </template>

        <!-- Table Footer -->
        <template #custom-foot="">
          <!-- Project Prototype Row(s) -->
          <b-tr
            v-for="(prototype, index) in projectRolesPrototype"
            :key="index"
          >
            <b-td>{{ prototype.project.name }} <br /> </b-td>
            <b-td>
              <div
                class="d-flex justify-content-between align-items-center"
                style="gap: 0.625rem"
              >
                <multiselect
                  v-model="prototype.role"
                  :placeholder="$t('admin.select_role')"
                  :options="availableRoles"
                  :id="index"
                  :disabled="prototype.disabled"
                  :open-direction="isLastRow(index, true) ? 'top' : 'auto'"
                  @input="onRolePrototypeSelection"
                  label="name"
                  track-by="uuid"
                  class="multiselect"
                ></multiselect>
                <b-button
                  v-if="!prototype.loading"
                  small
                  class="action-icon"
                  @click="removeProjectPrototype(prototype.project.uuid)"
                  v-b-tooltip.hover
                  :title="$t('message.cancel')"
                >
                  <i class="fa fa-tasks"></i>
                </b-button>
                <b-spinner v-else small variant="primary"></b-spinner>
              </div>
            </b-td>
          </b-tr>

          <!-- Add Project Row -->
          <b-tr @click="showProjectModal">
            <b-td colspan="2">
              <div class="ml-auto">
                <b-button
                  size="sm"
                  class="pull-right action-icon"
                  v-b-tooltip.hover
                  :title="$t('admin.add_project')"
                >
                  <span class="fa fa-plus-square"></span>
                </b-button>
              </div>
            </b-td>
          </b-tr>
        </template>
      </b-table>
    </div>

    <!-- Pagination -->
    <div
      class="w-100 px-1 d-flex justify-content-between align-items-stretch"
      style="gap: 0.3125rem"
      v-if="shouldRenderPagination"
    >
      <div
        class="d-flex justify-content-center align-items-center"
        style="gap: 0.3125rem"
      >
        <b-dropdown
          :text="paginationOptionsText"
          variant="outline-primary"
          size="sm"
          class="pagination-dropdown"
        >
          <b-dropdown-item
            v-for="option in paginationOptions"
            :key="option"
            @click="perPage = option"
            :active="perPage === option"
          >
            {{ option }}
          </b-dropdown-item>

          <b-dropdown-item @click="perPage = 0" :active="perPage === 0">{{
            $t('admin.pagination_all')
          }}</b-dropdown-item>
        </b-dropdown>
        <span v-if="perPage !== 0" class="text-center">{{
          currentPageText
        }}</span>
      </div>
      <b-pagination
        :style="{ visibility: perPage === 0 ? 'hidden' : 'visible' }"
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="rows"
        first-number
        class="m-0 h-100"
      ></b-pagination>
    </div>

    <select-project-modal
      :username="username"
      @selection="createPrototypeMapping"
    />
  </div>
</template>

<script>
/**
 * Props for UserProjectRolesTable
 *
 * @prop {String} username - Required. The username of the user whose project roles are being managed.
 * @prop {Array<Object>} projectRoles - Required. List of project-role mappings for the user.
 *   Each item should have the following structure:
 *   {
 *     user: {
 *       username: String, // The username of the user
 *       // ...other user fields
 *     },
 *     project: {
 *       uuid: String,     // Unique project identifier
 *       name: String,     // Project name
 *       // ...other project fields (e.g., active, classifier, etc.)
 *     },
 *     role: {
 *       uuid: String,     // Unique role identifier
 *       name: String,     // Role name
 *       permissions: Array, // (optional) List of permissions
 *       // ...other role fields
 *     }
 *   }
 * @prop {Array<Object>} availableRoles - Required. List of available roles to assign.
 *   Each item should have the following structure:
 *   {
 *     uuid: String,         // Unique role identifier
 *     name: String,         // Role name
 *     permissions: Array<{  // (optional) List of permissions for the role
 *       name: String,       // Permission name
 *       description: String // Permission description
 *     }>
 *     // ...other role fields
 *   }
 * @prop {Object} tableOptions - Optional. Table configuration options (pagination, filtering, etc).
 *   - paginationOptions: Number or array of numbers for per-page dropdown (optional)
 *      ignored if showPagination is false
 *   - showPagination: Boolean, show/hide pagination (optional)
 *   - tableFilter: String, initial filter value (optional)
 *   - inlineSearch: Boolean, enable inline search (optional)
 */

import Multiselect from 'vue-multiselect';
import SelectProjectModal from '../portfolio/projects/SelectProjectModal.vue';
import i18n from '../../i18n';
import _ from 'lodash';

const defaultTableOptions = {
  paginationOptions: [10, 25, 50],
  showPagination: true,
  tableFilter: null,
  inlineSearch: false,
};

const tableOptionsValidator = (value) => {
  if (typeof value !== 'object') return false;
  if ('paginationOptions' in value) {
    const options = value.paginationOptions;
    if (
      !(
        (Array.isArray(options) &&
          options.every((opt) => Number.isInteger(opt))) ||
        (Number.isInteger(options) && options > 0)
      )
    ) {
      console.warn(
        'Invalid paginationOptions, must be an integer or array of integers',
      );
      return false;
    }
  }
  if ('showPagination' in value && typeof value.showPagination !== 'boolean') {
    console.warn('Invalid showPagination, must be a boolean');
    return false;
  }
  if (
    'tableFilter' in value &&
    typeof value.tableFilter !== 'string' &&
    value.tableFilter !== null
  ) {
    console.warn('Invalid tableFilter, must be a string or null');
    return false;
  }
  if ('inlineSearch' in value && typeof value.inlineSearch !== 'boolean') {
    console.warn('Invalid inlineSearch, must be a boolean');
    return false;
  }
  return true;
};

export default {
  i18n,
  props: {
    username: { type: String, required: true },
    projectRoles: { required: true, default: null },
    availableRoles: { required: true, default: null },
    tableOptions: {
      type: Object,
      default: () => defaultTableOptions,
      validator: tableOptionsValidator,
    },
  },

  mixins: [],
  components: { Multiselect, SelectProjectModal },
  data() {
    return {
      // multiselect mutates its model which will cause violation errors, copy is requireds
      projectRolesCurrent: null, // mutable copy for display
      projectRolesPrototype: [], // for adding new project roles
      currentPage: 1,
      previousPage: null,
      searchActive: false,
      perPage: null,
      localTableFilter: null,
      fields: [
        {
          key: 'project',
          label: this.$t('admin.project'),
          thClass: 'project-column header-row',
          tdClass: 'project-column',
          sortable: true,
        },
        {
          key: 'role',
          label: this.$t('admin.role'),
          sortable: true,
          thClass: 'role-column header-row',
          tdClass: 'role-column',
        },
      ],
    };
  },

  created() {
    this.resolvePerPage();
  },

  computed: {
    mergedTableOptions() {
      return { ...defaultTableOptions, ...this.tableOptions };
    },

    rows() {
      return this.projectRolesCurrent?.length ?? 0;
    },

    paginationOptions() {
      const options = this.mergedTableOptions.paginationOptions;
      if (Array.isArray(options)) return options;
      return _.map(new Array(3), (_, i) => (i + 1) * this.perPageDefault);
    },

    paginationOptionsText() {
      return this.$t('admin.pagination_per_page', {
        count: this.perPage || this.$t('admin.pagination_all'),
      });
    },

    shouldRenderPagination() {
      return (
        this.mergedTableOptions.showPagination &&
        this.perPageDefault < this.rows
      );
    },

    shouldRenderInlineSearch() {
      return (
        this.mergedTableOptions.inlineSearch && this.shouldRenderPagination
      );
    },

    currentPageText() {
      const start = (this.currentPage - 1) * this.perPage + 1;
      const end = Math.min(this.currentPage * this.perPage, this.rows);
      return this.$t('admin.pagination_current', {
        start,
        end,
        total: this.rows,
      });
    },

    perPageDefault() {
      const options = this.mergedTableOptions.paginationOptions;
      if (Array.isArray(options)) return options[0];
      if (Number.isInteger(options) && options > 0) return options;
      return defaultTableOptions.paginationOptions[0];
    },
  },

  watch: {
    searchActive(newVal) {
      // safeguard against invalid page when filter is cleared
      if (newVal) {
        this.searchActive = true;
        this.previousPage = this.currentPage;
        this.currentPage = 1;
        return;
      }
      const maxPage = Math.ceil(this.rows / this.perPage) || 1;
      while (this.previousPage > maxPage) this.previousPage -= 1;
      this.currentPage = this.previousPage;
    },

    rows(newVal) {
      // safeguard against invalid page when rows change
      const maxPage = Math.ceil(newVal / this.perPage) || 1;
      if (this.currentPage <= maxPage) return;
      this.currentPage = maxPage;
    },

    projectRoles(newValue) {
      if (!newValue) return;
      this.assignProjectMapping(newValue);
    },

    localTableFilter(newVal, oldVal) {
      this.handleTableFilter(newVal, oldVal);
    },

    'mergedTableOptions.tableFilter'(newVal, oldVal) {
      this.handleTableFilter(newVal, oldVal);
    },
  },

  methods: {
    assignProjectMapping(project) {
      this.projectRolesCurrent = project.map((project) => ({
        ...project,
        // for multiselect
        disabled: false,
        loading: false,
      }));
    },

    resolvePerPage() {
      if (!this.mergedTableOptions.showPagination) {
        this.perPage = 0;
        return;
      }
      const options = this.mergedTableOptions.paginationOptions;
      this.perPage = Array.isArray(options) ? options[0] : options;
    },

    handleTableFilter(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.searchActive = !_.isEmpty(newVal);
    },

    createPrototypeMapping(projectSelections) {
      this.projectRolesPrototype = projectSelections.map((project) => ({
        project,
        // for multiselect
        role: null, // model, acts as blank role
        disabled: false,
        loading: false,
      }));
    },

    removeProjectPrototype(uuid) {
      const index = this.projectRolesPrototype.findIndex(
        (prototype) => prototype.project.uuid === uuid,
      );
      if (index !== -1) {
        this.projectRolesPrototype.splice(index, 1);
      }
    },

    // multiselect - utility
    debugRoleFormatter({ name, uuid }) {
      if (!name || !uuid) return;
      const maxLength = 8; // max length of uuid
      const truncatedUuid =
        maxLength === 0
          ? uuid
          : uuid.length <= maxLength
            ? uuid
            : uuid.slice(0, maxLength - 3) + '...';
      return `${name} - ${truncatedUuid}`;
    },

    // Add project role
    onRolePrototypeSelection(prototype, id) {
      const role = prototype;
      const project = this.projectRolesPrototype[id].project;
      this.projectRolesPrototype[id].loading = true;
      this.projectRolesPrototype[id].disabled = true;
      const error = (error) => {
        if (error?.response?.status === 304) {
          this.$toastr.w(this.$t('admin.role_already_assigned'));
        }

        this.projectRolesPrototype[id].disabled = false;
        this.projectRolesPrototype[id].loading = false;
        this.projectRolesPrototype[id].role = null;
      };

      // changes reflect when projectRoles is updated by parent
      // we just need to delete the prototype then signal the parent
      const success = () => {
        this.removeProjectPrototype(project.uuid);
      };
      this.$emit(
        'addProjectRole',
        { role: role.uuid, project: project.uuid },
        { success, error },
      );
    },

    // Update/change project role
    onRoleSelection(data, selectionData) {
      const targetRole = selectionData;
      const currentRole = data.item.role;
      const project = data.item.project;

      data.item.loading = true;
      data.item.disabled = true;
      const abortRoleChange = () => {
        data.item.disabled = false;
        data.item.loading = false;
        data.item.role = currentRole; // set to original
      };
      const roleChange = () => {
        data.item.disabled = false;
        data.item.loading = false;
      };

      const error = (error) => {
        if (error?.response?.status === 304) {
          this.$toastr.e(this.$t('admin.role_already_assigned'));
          roleChange();
        }
        abortRoleChange();
      };

      this.$emit(
        'updateProjectRole',
        { role: targetRole.uuid, project: project.uuid },
        { success: roleChange, error },
      );
    },

    // Remove project role
    onRemoveProjectRole(data) {
      const projectRole = {
        role: data.item.role.uuid,
        project: data.item.project.uuid,
      };
      this.$emit('removeProjectRole', projectRole);
    },

    showProjectModal() {
      this.$root.$emit('bv::show::modal', 'selectProjectModal');
    },

    // Partially mitigates issue where multiselect dropdown opens in the wrong direction
    isLastRow(index, isPrototype) {
      if (isPrototype) {
        return index === this.projectRolesPrototype.length - 1;
      }
      return (
        index === this.projectRolesCurrent.length - 1 &&
        !this.projectRolesPrototype.length
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

::v-deep .pagination {
  border: 1px solid var(--primary);
  box-sizing: border-box;
  border-radius: 0.2rem;

  .page-link,
  .page-item {
    border: none !important;
  }
}

::v-deep .pagination-dropdown {
  height: 100%;
  &:not(.show) > button:not(:hover) {
    background-color: $grey-750;
  }
}

::v-deep .project-column {
  white-space: no-wrap;
  text-wrap: wrap;
  max-width: 12.5rem;

  span {
    text-overflow: ellipsis;
  }
}

::v-deep .role-column {
  width: 60%;
}

::v-deep .header-row {
  padding: 0.75rem !important;
  align-content: center;
}

.multiselect {
  max-width: 31.25rem;
}

.action-icon {
  height: min-content;
  padding: 0;
  margin: 0;
  border: 0;
  background-color: transparent;

  .fa {
    font-size: 1.2rem;

    &.fa-edit {
      color: var(--secondary);
    }
    &.fa-trash-o {
      color: var(--danger);
    }
    &.fa-tasks {
      opacity: 30%;
    }
    &.fa-plus-square {
      color: var(--primary);
    }
  }
}

::v-deep .text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100%;
}
</style>
