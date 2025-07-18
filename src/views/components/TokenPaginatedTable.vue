<template>
  <div>
    <bootstrap-table
      ref="table"
      :columns="columns"
      :data="tableData"
      :options="tableOptions"
    >
    </bootstrap-table>
    <div class="mt-2 d-flex justify-content-between">
      <div>
        <b-form-group
          label="Rows per page"
          label-for="pagination-page-size-select"
          label-cols="auto"
        >
          <b-form-select
            id="pagination-page-size-select"
            v-model="currentPageSize"
          >
            <b-form-select-option
              v-for="pageSize in allowedPageSizes"
              :key="`pageSize-${pageSize}`"
              :value="pageSize"
              >{{ pageSize }}
            </b-form-select-option>
          </b-form-select>
        </b-form-group>
      </div>
      <div>
        <b-button-group id="pagination-button-group">
          <b-button
            id="pagination-button-prev"
            class="page-item page-link"
            v-if="hasPreviousPage"
            @click="goToPrevPage"
            >‹ Previous
          </b-button>
          <b-button
            id="pagination-button-next"
            class="page-item page-link"
            v-if="hasNextPage"
            @click="goToNextPage"
            >Next ›
          </b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/style';

.pagination-button {
  background: $pagination-bg;
  border-color: $pagination-border-color;
}

.pagination-button:hover {
  background: $pagination-hover-bg;
  border-color: $pagination-hover-border-color;
}
</style>

<script>
import bootstrapTableMixin from '@/mixins/bootstrapTableMixin';

export default {
  name: 'TokenPaginatedTable',
  mixins: [bootstrapTableMixin],
  props: {
    baseUrl: String,
    responseDataField: String,
    columns: Array,
    options: {},
  },
  data() {
    return {
      currentPageNumber: 1,
      currentPageSize: 10,
      currentPageUrl: null,
      allowedPageSizes: [5, 10, 25],
      nextPageUrl: null,
      pageUrlHistory: [],
      tableData: [],
      tableOptions: {
        showColumns: true,
        showRefresh: true,
        onRefresh: () => {
          this.refreshCurrentPage();
        },
        icons: {
          refresh: 'fa-refresh',
        },
        ...this.options,
      },
    };
  },
  computed: {
    hasNextPage() {
      return this.nextPageUrl !== undefined && this.nextPageUrl !== null;
    },
    hasPreviousPage() {
      return this.pageUrlHistory.length > 0;
    },
  },
  methods: {
    async loadPage(pageUrl) {
      this.$refs.table.showLoading();

      try {
        const url = new URL(pageUrl);
        url.searchParams.set('limit', this.currentPageSize);

        const response = await this.axios.get(url.toString());
        const responseData = await response.data;

        this.tableData = responseData[this.responseDataField] || [];
        this.currentPageUrl = pageUrl;
        this.nextPageUrl = responseData._pagination.links.next;
      } catch (err) {
        this.tableData = [];
        this.currentPageNumber = 1;
        this.nextPageUrl = null;
      } finally {
        this.$refs.table.hideLoading();
      }
    },
    async goToPrevPage() {
      if (!this.hasPreviousPage) {
        return;
      }

      this.currentPageNumber--;

      if (this.currentPageNumber === 1) {
        this.pageUrlHistory = [];
        await this.loadPage(this.baseUrl);
      } else {
        const prevPageUrl = this.pageUrlHistory.pop();
        await this.loadPage(prevPageUrl);
      }
    },
    async refreshCurrentPage() {
      await this.loadPage(this.currentPageUrl);
    },
    async goToNextPage() {
      if (!this.hasNextPage) {
        return;
      }

      this.pageUrlHistory.push(this.currentPageUrl);

      this.currentPageNumber++;
      await this.loadPage(this.nextPageUrl);
    },
  },
  mounted() {
    this.loadPage(this.baseUrl);
  },
  watch: {
    async currentPageSize() {
      this.currentPageNumber = 1;
      this.pageUrlHistory = [];
      this.nextPageUrl = null;
      await this.loadPage(this.baseUrl);
    },
  },
};
</script>
