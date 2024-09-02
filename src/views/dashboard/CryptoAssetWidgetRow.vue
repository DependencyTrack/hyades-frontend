<template>
  <b-row>
    <b-col sm="6" lg="4">
      <b-card no-body class="bg-widget">
        <b-card-body class="pb-0">
          <h4 class="mb-0">{{ numberOfCryptographicAssets }}</h4>
          <p>{{ $t('message.numberOfCryptoAssets') }}</p>
        </b-card-body>
        <widget-crypto-assets
          ref="widgetCryptoAssets"
          chartId="card-chart-01"
          class="chart-wrapper px-3"
          style="height: 70px"
          :height="70"
        />
      </b-card>
    </b-col>
    <b-col sm="6" lg="4">
      <b-card no-body class="bg-widget">
        <b-card-body class="pb-0">
          <h4 class="mb-0">
            <span style="text-transform: uppercase"
              >{{ mostUsedAlgorithmName }}
            </span>
            <span style="font-size: 14px; opacity: 0.7"
              >({{ mostUsedAlgorithmPercentage }}%)</span
            >
          </h4>
          <p>{{ $t('message.mostUsedAlgorithm') }}</p>
        </b-card-body>
        <widget-most-used-algorithm
          ref="widgetMostUsedAlgorithm"
          chartId="card-chart-01"
          class="chart-wrapper px-3"
          style="height: 70px"
          :height="70"
        />
      </b-card>
    </b-col>
    <b-col sm="6" lg="4">
      <b-card no-body class="bg-widget">
        <b-card-body class="pb-0">
          <h4 class="mb-0">
            {{ numberOfKeys }}
          </h4>
          <p>{{ $t('message.numberOfKeys') }}</p>
        </b-card-body>
        <widget-number-of-keys
          ref="widgetNumberOfKeys"
          chartId="card-chart-03"
          class="chart-wrapper px-3"
          style="height: 70px"
          :height="70"
        />
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import WidgetCryptoAssets from '@/views/dashboard/WidgetCryptoAssets.vue';
import WidgetMostUsedAlgorithm from '@/views/dashboard/WidgetMostUsedAlgorithm.vue';
import WidgetNumberOfKeys from '@/views/dashboard/WidgetNumberOfKeys.vue';

export default {
  components: {
    WidgetCryptoAssets,
    WidgetMostUsedAlgorithm,
    WidgetNumberOfKeys,
  },
  props: {
    fetch: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      numberOfCryptographicAssets: 0,
      mostUsedAlgorithmName: '',
      mostUsedAlgorithmPercentage: 0.0,
      numberOfKeys: 0,
    };
  },
  beforeMount() {
    if (this.fetch) {
      const daysBack = 90;
      let url = `${this.$api.BASE_URL}/${this.$api.URL_METRICS}/cryptography/${daysBack}/days`;
      this.axios.get(url).then((response) => {
        this.render(response.data);
      });
    }
  },
  methods: {
    render: function (metrics) {
      if (metrics.length > 0) {
        this.numberOfCryptographicAssets =
          metrics[metrics.length - 1].numberOfCryptographicAssets;
        this.mostUsedAlgorithmName =
          metrics[metrics.length - 1].mostUsedAlgorithmName;
        this.mostUsedAlgorithmPercentage =
          metrics[metrics.length - 1].mostUsedAlgorithmPercentage;
        this.numberOfKeys = metrics[metrics.length - 1].numberOfKeys;
      } else {
        this.numberOfCryptographicAssets = 0;
        this.mostUsedAlgorithmName = "";
        this.mostUsedAlgorithmPercentage = 0;
        this.numberOfKeys = 0;
      }

      this.$refs.widgetCryptoAssets.render(metrics);
      this.$refs.widgetMostUsedAlgorithm.render(metrics);
      this.$refs.widgetNumberOfKeys.render(metrics);
    },
  },
};
</script>
