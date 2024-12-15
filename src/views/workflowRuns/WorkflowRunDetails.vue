<template>
  <div class="row">
    <div class="col-6">
      <b-card no-body>
        <b-card-body>
          <div class="d-flex justify-content-between">
            <h2>
              {{ run.workflowName }}
              <span class="badge badge-light">v{{ run.workflowVersion }}</span>
            </h2>
            <b-button-group>
              <b-button :disabled="!canBePaused"
                ><span class="fa fa-pause"></span
              ></b-button>
              <b-button :disabled="!canBeResumed"
                ><span class="fa fa-play"></span
              ></b-button>
              <b-button :disabled="!canBeCancelled"
                ><span class="fa fa-ban"></span
              ></b-button>
            </b-button-group>
          </div>
          <hr />
          <div class="d-flex align-items-start">
            <a
              v-for="tag in run.tags"
              class="badge badge-pill badge-secondary mr-2 font-sm"
              :href="tagLink(tag)"
            >
              <span class="fa fa-tag">&nbsp;</span> {{ tag }}
            </a>
          </div>
        </b-card-body>
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
              <div
                v-if="slotProps.item.argument || slotProps.item.result"
                class="mt-1"
              >
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
      parentRun: null,
      timelineItems: [],
      pollInterval: null,
    };
  },
  computed: {
    isCompleted() {
      return (
        this.run &&
        this.run.runtimeStatus !== 'PENDING' &&
        this.run.runtimeStatus !== 'RUNNING' &&
        this.run.runtimeStatus !== 'SUSPENDED'
      );
    },
    canBePaused() {
      if (this.isCompleted || this.run.runtimeStatus === 'SUSPENDED') {
        return false;
      } else if (!this.run.eventInbox) {
        return true;
      }

      for (let event of this.run.eventInbox) {
        if (event.runSuspended) {
          return false;
        }
      }

      return true;
    },
    canBeResumed() {
      if (this.isCompleted || this.run.runtimeStatus !== 'SUSPENDED') {
        return false;
      } else if (!this.run.eventInbox) {
        return true;
      }

      for (let event of this.run.eventInbox) {
        if (event.runResumed) {
          return false;
        }
      }

      return true;
    },
    canBeCancelled() {
      if (this.isCompleted) {
        return false;
      } else if (!this.run.eventInbox) {
        return true;
      }

      for (let event of this.run.eventInbox) {
        if (event.runCancelled) {
          return false;
        }
      }

      return true;
    },
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
    tagLink(tag) {
      if (!tag) {
        return '#';
      }

      const tagParts = tag.split('=', 2);
      if (tagParts.length !== 2) {
        return '#';
      }

      if (tagParts[0] === 'project') {
        return this.$router.resolve({
          name: 'Project',
          params: { uuid: tagParts[1] },
        }).href;
      }

      return '#';
    },
    loadData() {
      this.axios
        .get(
          `${this.$api.BASE_URL}/${this.$api.URL_WORKFLOW}/run/${this.runId}`,
        )
        .then((response) => {
          if (this.run && this.run.updatedAt === response.data.updatedAt) {
            return;
          }

          let run = response.data;
          let events = [];
          let activityByScheduledEventId = new Map();
          let subWorkflowRunByScheduledEventId = new Map();
          let timerByScheduledEventId = new Map();

          for (let event of run.eventLog) {
            if (event.runScheduled) {
              events.push({
                timestamp: event.timestamp,
                title: 'Run scheduled',
                argument: this.jsonFromPayload(event.runScheduled.argument),
              });

              if (event.runScheduled.parentRun) {
                this.parentRun = event.runScheduled.parentRun;
              }
            } else if (event.runStarted) {
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
              const eventId = event.id || 0;
              const activityName = event.activityTaskScheduled.name;
              activityByScheduledEventId.set(eventId, activityName);

              events.push({
                eventId: eventId,
                timestamp: event.timestamp,
                title: `Activity "${activityName}" scheduled`,
                argument: this.jsonFromPayload(
                  event.activityTaskScheduled.argument,
                ),
              });
            } else if (event.activityTaskCompleted) {
              const scheduledEventId =
                event.activityTaskCompleted.taskScheduledEventId || 0;
              const activityName =
                activityByScheduledEventId.get(scheduledEventId);
              events.push({
                eventId: scheduledEventId,
                timestamp: event.timestamp,
                title: `Activity "${activityName}" completed`,
                result: this.jsonFromPayload(
                  event.activityTaskCompleted.result,
                ),
              });
            } else if (event.activityTaskFailed) {
              const scheduledEventId =
                event.activityTaskFailed.taskScheduledEventId || 0;
              const activityName =
                activityByScheduledEventId.get(scheduledEventId);
              events.push({
                eventId: scheduledEventId,
                timestamp: event.timestamp,
                title: `Activity "${activityName}" failed`,
                content: event.activityTaskFailed.failureDetails,
              });
            } else if (event.subWorkflowRunScheduled) {
              const eventId = event.id || 0;
              const subWorkflowRun = {
                runId: event.subWorkflowRunScheduled.runId,
                name: event.subWorkflowRunScheduled.workflowName,
                version: event.subWorkflowRunScheduled.workflowVersion,
              };
              subWorkflowRunByScheduledEventId.set(eventId, subWorkflowRun);
              events.push({
                eventId: eventId,
                timestamp: event.timestamp,
                // TODO: Render workflow name as hyperlink to the respective run.
                title: `Sub workflow run "${subWorkflowRun.name} v${subWorkflowRun.version}" scheduled`,
                argument: this.jsonFromPayload(
                  event.subWorkflowRunScheduled.argument,
                ),
              });
            } else if (event.subWorkflowRunCompleted) {
              const scheduledEventId =
                event.subWorkflowRunCompleted.runScheduledEventId;
              const subWorkflowRun =
                subWorkflowRunByScheduledEventId.get(scheduledEventId);
              events.push({
                eventId: scheduledEventId,
                timestamp: event.timestamp,
                // TODO: Render workflow name as hyperlink to the respective run.
                title: `Sub workflow run "${subWorkflowRun.name} v${subWorkflowRun.version}" completed`,
                result: this.jsonFromPayload(
                  event.subWorkflowRunCompleted.result,
                ),
              });
            } else if (event.subWorkflowRunFailed) {
              const scheduledEventId =
                event.subWorkflowRunFailed.runScheduledEventId;
              const subWorkflowRun =
                subWorkflowRunByScheduledEventId.get(scheduledEventId);
              events.push({
                eventId: scheduledEventId,
                timestamp: event.timestamp,
                title: `Sub workflow run "${subWorkflowRun.runId}" failed`,
                // TODO: Failure details.
                content: `Workflow: ${subWorkflowRun.name}/${subWorkflowRun.version}`,
              });
            } else if (event.sideEffectExecuted) {
              events.push({
                eventId: event.sideEffectExecuted.sideEffectEventId || 0,
                timestamp: event.timestamp,
                title: `Side effect "${event.sideEffectExecuted.name}" executed`, // TODO: Name?
                result: this.jsonFromPayload(event.sideEffectExecuted.result),
              });
            } else if (event.timerScheduled) {
              const eventId = event.id || 0;
              const timerName = event.timerScheduled.name;
              timerByScheduledEventId.set(eventId, timerName);
              events.push({
                eventId: eventId,
                timestamp: event.timestamp,
                title: `Timer "${timerName}" scheduled`,
                content: `Elapses at: ${common.formatTimestamp(event.timerScheduled.elapseAt, true)}`,
              });
            } else if (event.timerFired) {
              const scheduledEventId =
                event.timerFired.timerScheduledEventId || 0;
              const timer = timerByScheduledEventId.get(scheduledEventId);
              events.push({
                eventId: scheduledEventId,
                timestamp: event.timerFired.elapseAt,
                title: `Timer "${timer}" fired`,
              });
            } else if (event.externalEventReceived) {
              events.push({
                timestamp: event.timestamp,
                title: `External event "${event.externalEventReceived.id}" received`,
                result: this.jsonFromPayload(
                  event.externalEventReceived.content,
                ),
              });
            }
          }

          this.run = run;
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
        let protoContent = structuredClone(payload.protoContent);
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
