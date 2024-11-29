<template>
  <b-card no-body :header="header">
    <b-card-body>
      <event-timeline
        :items="timelineItems"
        :reverse="false"
        :loading="!isCompleted"
        variant="primary"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import EventTimeline from '@/views/components/EventTimeline';
import common from '@/shared/common';

export default {
  props: {
    header: String,
  },
  components: { EventTimeline },
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
              });
            } else if (event.activityTaskCompleted) {
              const activityName = activityByScheduledEventId.get(
                event.activityTaskCompleted.taskScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Activity ${activityName} completed`,
              });
            } else if (event.activityTaskFailed) {
              const activityName = activityByScheduledEventId.get(
                event.activityTaskFailed.taskScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Activity ${activityName} failed`,
                // TODO: Failure details.
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
              });
            } else if (event.subWorkflowRunCompleted) {
              const subWorkflowRun = subWorkflowRunByScheduledEventId.get(
                event.subWorkflowRunCompleted.runScheduledEventId,
              );
              events.push({
                timestamp: event.timestamp,
                title: `Sub workflow run ${subWorkflowRun.runId} completed`,
                content: `Workflow: ${subWorkflowRun.name}/${subWorkflowRun.version}`,
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
        });
    },
  },
};
</script>
