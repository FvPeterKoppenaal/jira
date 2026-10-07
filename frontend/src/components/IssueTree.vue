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
        :style="{ '--depth': depth }"
    >

      <div class="issue-identity">
        <button
            v-if="issue.children.length"
            class="expand-button"
            :aria-expanded="expanded"
            :aria-label="`${expanded ? 'Inklappen' : 'Uitklappen'} ${issue.key}`"
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
      </div>

      <span data-label="Type">
        {{ issue.issueType }}
      </span>

      <span data-label="Status">
        {{ issue.status.name }} ({{ issue?.status?.statusCategory?.key }})
      </span>

      <span data-label="Assignee">
        {{ issue?.assignee?.displayName ?? 'Unassigned' }}
      </span>
      <span data-label="Geschatte tijd (uur)">
        {{ issue.timetracking.originalEstimateSeconds ? (issue.timetracking.originalEstimateSeconds / 3600) : 0 }}
      </span>
      <span data-label="Geboekte tijd (uur)">
        {{ issue.timetracking.timeSpentSeconds ? (issue.timetracking.timeSpentSeconds / 3600) : 0 }}
      </span>
      <span data-label="Resterende tijd (uur)">
        {{ issue.timetracking.remainingEstimateSeconds ? (issue.timetracking.remainingEstimateSeconds / 3600) : 0 }}
      </span>
      <span data-label="Sprint">
        {{ issue.sprint ? issue.sprint.name : '' }}
      </span>
      <span data-label="Labels">
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
  grid-template-columns: var(--tree-columns);
  min-width: var(--tree-width);
  box-sizing: border-box;
  padding: 8px;

  align-items: center;
  min-height: 40px;
  gap: 8px;

  border-bottom: 1px solid #ddd;
}

.issue-row > * {
  min-width: 0;
  overflow-wrap: anywhere;
}

.issue-row:hover {
  background: #f5f5f5;
}

.issue-identity {
  grid-column: 1 / 4;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: min(calc(var(--depth) * 24px), 192px);
}

.issue-identity > * {
  min-width: 0;
  overflow-wrap: anywhere;
}

.expand-button,
.expand-placeholder {
  flex: 0 0 24px;
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
  flex: 0 0 100px;
  white-space: nowrap;
}

.summary {
  flex: 1;
}

@media (max-width: 800px) {
  .issue-row {
    grid-template-columns: 24px minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: 12px 8px;
    padding: 12px;
    margin-left: min(calc(var(--depth) * 16px), 80px);
    border-left: 2px solid #dce8d9;
  }

  .issue-identity {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr);
    padding-left: 0;
  }

  .expand-button {
    min-height: 44px;
  }

  .key {
    grid-column: 2 / -1;
    align-self: center;
    white-space: normal;
  }

  .summary {
    grid-column: 1 / -1;
    padding-left: 0;
  }

  [data-label] {
    grid-column: span 1;
    display: grid;
    gap: 4px;
  }

  [data-label]::before {
    content: attr(data-label);
    font-size: 12px;
    font-weight: 600;
    color: #52604e;
  }

  [data-label="Type"],
  [data-label="Assignee"],
  [data-label="Geboekte tijd (uur)"],
  [data-label="Sprint"] {
    grid-column: 1 / 3;
  }
}
</style>
