<script setup lang="ts">
import { storeToRefs } from 'pinia'
import IssueTree from '@/components/IssueTree.vue'

import { useHierarchyStore } from '@/stores/hierarchy'

const store = useHierarchyStore()

const {
  availableSprints,
  availableLabels,
  availableAssignees,
  hierarchy,
  filteredHierarchy,
  loading,
  error,
  rootKey,
  selectedSprint,
  selectedLabel,
  selectedAssignee
} = storeToRefs(store)

const {
  loadHierarchy,
} = store
</script>

<template>
  <main>
    <h1>Jira hierarchy</h1>

    <form
        class="search"
        @submit.prevent="loadHierarchy"
    >
      <input
          v-model="rootKey"
          placeholder="e.g. FV-123"
      >

      <select
          v-model="selectedSprint"
          :disabled="!hierarchy"
      >
        <option value="">
          All sprints
        </option>

        <option
            v-for="sprint in availableSprints"
            :key="sprint.id"
            :value="sprint.id"
        >
          {{ sprint.name }}
        </option>
      </select>

      <select v-model="selectedLabel">
        <option :value="null">
          All labels
        </option>

        <option
            v-for="label in availableLabels"
            :key="label"
            :value="label"
        >
          {{ label }}
        </option>
      </select>

      <select
          v-model="selectedAssignee"
          :disabled="!hierarchy"
      >
        <option value="">
          All assignees
        </option>

        <option
            v-for="assignee in availableAssignees"
            :key="assignee.accountId"
            :value="assignee.accountId"
        >
          {{ assignee.displayName }}
        </option>
      </select>

      <button type="submit">
        Load
      </button>
    </form>

    <p v-if="loading">
      Loading…
    </p>

    <p
        v-if="error"
        class="error"
    >
      {{ error }}
    </p>

    <div
        v-if="filteredHierarchy"
        class="tree"
    >
      <div class="header">
        <span/>
        <span>Key</span>
        <span>Summary</span>
        <span>Type</span>
        <span>Status</span>
        <span>Assignee</span>
        <span>Geschatte tijd</span>
        <span>Geboekte tijd</span>
        <span>Resterende tijd</span>
        <span>Sprint</span>
        <span>Labels</span>
      </div>

      <IssueTree :issue="filteredHierarchy"/>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 40px auto;
  padding: 0 24px;
}

.search {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.search input {
  width: 250px;
  padding: 8px 12px;
}

.search button {
  padding: 8px 16px;
}

.tree {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.header {
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

  gap: 8px;
  padding: 8px;

  font-weight: bold;
  border-bottom: 2px solid #ccc;
}

.error {
  color: red;
}
</style>