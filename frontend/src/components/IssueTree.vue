<script setup lang="ts">
import {ref} from 'vue'
import type {Issue} from "@/types/Issue.ts";

withDefaults(
    defineProps<{
      issue: Issue
      depth?: number
    }>(),
    {
      depth: 0,
    },
)

const expanded = ref(true)
</script>

<template>
  <div>
    <div
        class="issue-row"
        :style="{ paddingLeft: `${depth * 24 + 8}px` }"
    >

      <button
          v-if="issue.children.length"
          class="expand-button"
          @click="expanded = !expanded"
      >
        {{ expanded ? '▼' : '▶' }}
      </button>

      <span
          v-else
          class="expand-placeholder"
      />

      <strong class="key">
        <a :href="`https://flikweertvision.atlassian.net/browse/${issue.key}`" target="_blank">
          {{ issue.key }}
        </a>
      </strong>

      <span class="summary">
        {{ issue.summary }}
      </span>

      <span>
        {{ issue.issueType }}
      </span>

      <span>
        {{ issue.status.name }} ({{ issue?.status?.statusCategory?.key }})
      </span>

      <span>
        {{ issue?.assignee?.displayName ?? 'Unassigned' }}
      </span>
      <span>
        {{ issue.timetracking.originalEstimateSeconds ? (issue.timetracking.originalEstimateSeconds / 3600) : 0 }}
      </span>
      <span>
        {{ issue.timetracking.timeSpentSeconds ? (issue.timetracking.timeSpentSeconds / 3600) : 0 }}
      </span>
      <span>
        {{ issue.timetracking.remainingEstimateSeconds ? (issue.timetracking.remainingEstimateSeconds / 3600) : 0 }}
      </span>
      <span>
        {{ issue.sprint ? issue.sprint.name : '' }}
      </span>
      <span>
        {{ issue?.labels.join(', ') }}
      </span>
    </div>

    <template v-if="expanded">
      <IssueTree
          v-for="child in issue.children"
          :key="child.key"
          :issue="child"
          :depth="depth + 1"
      />
    </template>
  </div>
</template>

<style scoped>
.issue-row {
  display: grid;
  grid-template-columns:
    24px
    100px
    minmax(300px, 1fr)
    130px
    140px
    160px
    180px
    180px
180px
180px
180px;

  align-items: center;
  min-height: 40px;
  gap: 8px;

  border-bottom: 1px solid #ddd;
}

.issue-row:hover {
  background: #f5f5f5;
}

.expand-button {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.expand-placeholder {
  width: 24px;
}

.key {
  white-space: nowrap;
}

.summary {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>