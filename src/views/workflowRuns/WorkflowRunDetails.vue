<template>
  <div class="row">
    <div class="col-6">
      <b-card no-body>
        <b-card-body> </b-card-body>
      </b-card>
    </div>
    <div class="col-6">
      <b-card no-body header="History">
        <b-card-body>
          <event-timeline
            :items="timelineItems"
            :reverse="true"
            :loading="!isCompleted"
            variant="primary"
          >
            <template v-slot:item="slotProps">
              <p v-if="slotProps.item.content">{{ slotProps.item.content }}</p>
              <div v-if="slotProps.item.argument || slotProps.item.result">
                <ul
                  class="nav nav-tabs"
                  :id="`history-event-${slotProps.index}-payload-tab`"
                  role="tablist"
                >
                  <li
                    v-if="slotProps.item.argument"
                    class="nav-item"
                    role="presentation"
                  >
                    <a
                      class="nav-link active"
                      :id="`history-event-${slotProps.index}-payload-tab-argument`"
                      data-toggle="tab"
                      role="tab"
                      :aria-controls="`history-event-${slotProps.index}-payload-tab-argument-content`"
                      aria-selected="false"
                      ><span class="fa fa-inbox"></span>&nbsp; Argument</a
                    >
                  </li>
                  <li
                    v-if="slotProps.item.result"
                    class="nav-item"
                    role="presentation"
                  >
                    <a
                      class="nav-link"
                      :id="`history-event-${slotProps.index}-payload-tab-result`"
                      data-toggle="tab"
                      role="tab"
                      :aria-controls="`history-event-${slotProps.index}-payload-tab-result-content`"
                      :aria-selected="!slotProps.item.argument"
                      ><span class="fa fa-arrow-right"></span>&nbsp; Result</a
                    >
                  </li>
                </ul>
                <div
                  class="tab-content p-0"
                  :id="`history-event-${slotProps.index}-payload-tab-content`"
                >
                  <div
                    v-if="slotProps.item.argument"
                    class="tab-pane fade show active p-0"
                    :id="`history-event-${slotProps.index}-payload-tab-argument-content`"
                    role="tabpanel"
                    :aria-labelledby="`history-event-${slotProps.index}-payload-tab-argument`"
                  >
                    <vue-json-pretty
                      :deep="1"
                      :showLength="true"
                      :data="slotProps.item.argument"
                    />
                  </div>
                  <div
                    v-if="slotProps.item.result"
                    :class="`tab-pane fade p-0 ${!slotProps.item.argument ? 'show active' : ''}`"
                    :id="`history-event-${slotProps.index}-payload-tab-result-content`"
                    role="tabpanel"
                    :aria-labelledby="`history-event-${slotProps.index}-payload-tab-result`"
                  >
                    <vue-json-pretty
                      :deep="1"
                      :showLength="true"
                      :data="slotProps.item.result"
                    />
                  </div>
                </div>
              </div>
            </template>
          </event-timeline>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import EventTimeline from '@/views/components/EventTimeline';
import common from '@/shared/common';
import EventBus from '@/shared/eventbus';

export default {
  props: {
    header: String,
  },
  components: { EventTimeline, VueJsonPretty },
  data() {
    return {
      runId: null,
      run: null,
      isCompleted: false,
      timelineItems: [],
      pollInterval: null,
    };
  },
  beforeMount() {
    this.runId = this.$route.params.runId;
  },
  mounted() {
    this.loadData();
  },
  destroyed() {
    EventBus.$emit('crumble');
  },
  methods: {
    loadData() {
      this.axios
        .get(
          `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run/${this.runId}`,
        )
        .then((response) => {
          if (this.run && this.run.updatedAt === response.data.updatedAt) {
            return;
          }

          this.run = response.data;
          this.isCompleted =
            this.run.runtimeStatus !== 'PENDING' &&
            this.run.runtimeStatus !== 'RUNNING' &&
            this.run.runtimeStatus !== 'SUSPENDED';

          let events = [];
          let activityByScheduledEventId = new Map();
          let subWorkflowRunByScheduledEventId = new Map();
          let timerByScheduledEventId = new Map();

          for (let event of this.run.eventLog) {
            if (event.runStarted) {
              events.push({
                timestamp: event.timestamp,
                title: `Run started`,
              });
            } else if (event.runCancelled) {
              events.push({
                timestamp: event.timestamp,
                title: `Run cancelled`,
                // TODO: Principal.
                content: `Reason: ${event.runCancelled.reason}`,
              });
            } else if (event.runCompleted) {
              events.push({
                timestamp: event.timestamp,
                title: `Run completed`,
                content: `Status: ${event.runCompleted.status}`,
              });
            } else if (event.runSuspended) {
              events.push({
                timestamp: event.timestamp,
                title: `Run suspended`,
              });
            } else if (event.runResumed) {
              events.push({
                timestamp: event.timestamp,
                title: `Run resumed`,
              });
            } else if (event.activityTaskScheduled) {
              const activityName = event.activityTaskScheduled.name;
              activityByScheduledEventId.set(event.id, activityName);

              events.push({
                timestamp: event.timestamp,
                title: `Activity ${activityName} scheduled`,
                argument: this.jsonFromPayload(
                  event.activityTaskScheduled.argument,
                ),
              });
            } else if (event.activityTaskCompleted) {
              const activityName = activityByScheduledEventId.get(
                event.activityTaskCompleted.taskScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Activity ${activityName} completed`,
                result: this.jsonFromPayload(
                  event.activityTaskCompleted.result,
                ),
              });
            } else if (event.activityTaskFailed) {
              const activityName = activityByScheduledEventId.get(
                event.activityTaskFailed.taskScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Activity ${activityName} failed`,
                content: event.activityTaskFailed.failureDetails,
              });
            } else if (event.subWorkflowRunScheduled) {
              const subWorkflowRun = {
                runId: event.subWorkflowRunScheduled.runId,
                name: event.subWorkflowRunScheduled.workflowName,
                version: event.subWorkflowRunScheduled.workflowVersion,
              };
              subWorkflowRunByScheduledEventId.set(event.id, subWorkflowRun);
              events.push({
                timestamp: event.timestamp,
                title: `Sub workflow run ${subWorkflowRun.runId} scheduled`,
                content: `Workflow: ${subWorkflowRun.name}/${subWorkflowRun.version}`,
                argument: this.jsonFromPayload(
                  event.subWorkflowRunScheduled.argument,
                ),
              });
            } else if (event.subWorkflowRunCompleted) {
              const subWorkflowRun = subWorkflowRunByScheduledEventId.get(
                event.subWorkflowRunCompleted.runScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Sub workflow run ${subWorkflowRun.runId} completed`,
                content: `Workflow: ${subWorkflowRun.name}/${subWorkflowRun.version}`,
                result: this.jsonFromPayload(
                  event.subWorkflowRunCompleted.result,
                ),
              });
            } else if (event.subWorkflowRunFailed) {
              const subWorkflowRun = subWorkflowRunByScheduledEventId.get(
                event.subWorkflowRunFailed.runScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Sub workflow run ${subWorkflowRun.runId} failed`,
                // TODO: Failure details.
                content: `Workflow: ${subWorkflowRun.name}/${subWorkflowRun.version}`,
              });
            } else if (event.sideEffectExecuted) {
              events.push({
                timestamp: event.timestamp,
                title: `Side effect executed`, // TODO: Name?
                result: this.jsonFromPayload(event.sideEffectExecuted.result),
              });
            } else if (event.timerScheduled) {
              timerByScheduledEventId.set(event.id, 'name'); // TODO: Add named timers.
              events.push({
                timestamp: event.timestamp,
                title: `Timer (name) scheduled`,
                content: `Elapses at: ${common.formatTimestamp(event.timerScheduled.elapseAt, true)}`,
              });
            } else if (event.timerFired) {
              const timer = timerByScheduledEventId.get(
                event.timerFired.timerScheduledEventId,
              );
              events.push({
                timestamp: event.timerFired.elapseAt,
                title: `Timer ${timer} fired`,
              });
            } else if (event.externalEventReceived) {
              events.push({
                timestamp: event.timestamp,
                title: `External event ${event.externalEventReceived.id} received`,
                result: this.jsonFromPayload(
                  event.externalEventReceived.content,
                ),
              });
            }
          }

          this.timelineItems = events;

          if (!this.isCompleted && !this.pollInterval) {
            this.pollInterval = setInterval(this.loadData, 3000);
          } else if (this.isCompleted && this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
          }

          EventBus.$emit(
            'addCrumb',
            `${this.run.workflowName} v${this.run.workflowVersion} ▸ ${this.runId}`,
          );
        });
    },
    jsonFromPayload(payload) {
      if (payload && payload.protoContent) {
        let protoContent = payload.protoContent;
        delete protoContent['@type'];
        return protoContent;
      }

      return null;
    },
  },
};
</script>

<style lang="scss">
@import '../../assets/scss/style.scss';

.vjs-tree {
  @extend code;
  padding: 0.5em;
}

.vjs-tree-node {
  &.is-highlight,
  &:hover {
    background-color: $secondary;
  }
}
</style>
