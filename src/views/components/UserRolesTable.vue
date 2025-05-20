<!-- Table containing the users participating project and their respective roles -->
<template>
  <div>
    <b-table :items="projectRoles" :fields="fields">
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
            v-model="projectRolesCurrent[data.index].role"
            :options="availableRoles"
            :id="data.index"
            :allow-empty="false"
            @input="onRoleSelection"
            :deselect-label="$t('admin.multiselect_remove_role')"
            :placeholder="$t('admin.select_role')"
            label="name"
            track-by="uuid"
            class="multiselect"
          ></multiselect>

          <b-button
            small
            class="action-icon"
            @click="onRemoveProjectRole(data)"
            v-if="!projectRolesCurrent[data.index].loading"
            v-b-tooltip.hover
            :title="$t('admin.remove_role')"
          >
            <span class="fa fa-trash-o"></span>
          </b-button>
          <b-spinner v-else small variant="primary"></b-spinner>
        </div>
      </template>

      <!-- Footer -->
      <template #custom-foot="">
        <!-- Project Prototyper -->
        <b-tr v-for="(prototype, index) in projectRolesPrototype" :key="index">
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
            <!-- *Project Prototype* -->
          </b-td>
        </b-tr>

        <!-- Add Project Row -->
        <b-tr @click="showProjectModal">
          <b-td colspan="2">
            <b-button
              size="sm"
              class="pull-right action-icon"
              v-on:click="$emit('actionClicked')"
              v-b-tooltip.hover
              :title="$t('admin.add_project')"
            >
              <span class="fa fa-plus-square"></span>
            </b-button>
          </b-td>
        </b-tr>
      </template>
    </b-table>

    <select-project-modal
      :username="parentContext.row.username"
      @selection="createPrototypeMapping"
    />
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import SelectProjectModal from '../portfolio/projects/SelectProjectModal.vue';
import i18n from '../../i18n';

export default {
  i18n,
  props: {
    parentContext: {
      type: Object,
      required: true,
      validator(value) {
        return (
          typeof value === 'object' &&
          Object.prototype.hasOwnProperty.call(value, 'row') &&
          Object.prototype.hasOwnProperty.call(value, 'index')
        );
      },
    },
    projectRoles: { type: Array, required: true, default: null },
    availableRoles: { type: Array, required: true, default: null },
  },
  mixins: [],
  components: { Multiselect, SelectProjectModal },
  created() {
    this.createProjectMapping(this.projectRoles);
  },
  data() {
    return {
      // multiselect mutates its model which will cause violation errors, copy is requireds
      projectRolesCurrent: [],
      projectRolesPrototype: [],
      fields: [
        {
          key: 'project',
          label: this.$t('admin.project'),
          thClass: 'project-column header-row',
          tdClass: 'project-column',
          sortable: false,
        },
        {
          key: 'role',
          label: this.$t('admin.role'),
          sortable: false,
          thClass: 'role-column header-row',
          tdClass: 'role-column',
        },
      ],
    };
  },
  watch: {
    projectRoles(newValue) {
      this.createProjectMapping(newValue);
    },
  },
  methods: {
    createProjectMapping(project) {
      this.projectRolesCurrent = project.map((project) => ({
        ...project,
        // for multiselect
        disabled: false,
        loading: false,
      }));
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
      const role = prototype.uuid;
      const project = this.projectRolesPrototype[id].project.uuid;
      this.projectRolesPrototype[id].loading = true;
      this.projectRolesPrototype[id].disabled = true;
      const error = () => {
        this.projectRolesPrototype[id].disabled = false;
        this.projectRolesPrototype[id].loading = false;
        this.projectRolesPrototype[id].role = null;
      };
      const success = () => {
        this.removeProjectPrototype(project);
      };
      this.$emit('addProjectRole', { role, project }, { success, error });
    },

    // Update/change project role
    onRoleSelection(data, id) {
      const role = data.uuid;
      const project = this.projectRoles[id].project.uuid;
      this.projectRolesCurrent[id].loading = true;
      this.projectRolesCurrent[id].disabled = true;
      const error = () => {
        this.projectRolesCurrent[id].disabled = false;
        this.projectRolesCurrent[id].loading = false;
        this.projectRolesCurrent[id].role = this.projectRoles[id].role;
      };
      const success = () => {
        this.projectRolesCurrent[id].disabled = false;
        this.projectRolesCurrent[id].loading = false;
      };

      this.$emit('updateProjectRole', { role, project }, { success, error });
    },

    // Remove project role
    onRemoveProjectRole(data) {
      const projectRole = {
        role: data.item.role.uuid,
        project: this.projectRolesCurrent[data.index].project.uuid,
      };
      this.$emit('removeProjectRole', projectRole);
    },

    showProjectModal() {
      this.$root.$emit('bv::show::modal', 'selectProjectModal');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep(.project-column) {
  white-space: no-wrap;
  text-wrap: wrap;
  max-width: 12.5rem;
}

::v-deep(.project-column span) {
  text-overflow: ellipsis;
}

::v-deep(.role-column) {
  width: 60%;
}

::v-deep(.header-row) {
  padding: 0.75rem !important;
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

.action-icon .fa-tasks {
  opacity: 30%;
}

.action-icon .fa-plus-square {
  color: var(--primary);
}

::v-deep(.text-ellipsis) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  width: 100%;
}
</style>
