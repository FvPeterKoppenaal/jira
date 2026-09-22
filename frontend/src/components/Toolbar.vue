<script setup lang="ts">
import {ref} from 'vue'
import type {Issue} from "@/types/Issue.ts";
import {useHierarchyStore} from '@/stores/hierarchy'
import {storeToRefs} from "pinia";

const store = useHierarchyStore()
withDefaults(
    defineProps<{
      hierarchy: Issue | null
      depth?: number
    }>(),
    {
      depth: 0,
    },
)
const {
  availableSprints,
  availableLabels,
  rootKey,
  selectedSprint,
  selectedLabel,
} = storeToRefs(store)

const {loadHierarchy} = useHierarchyStore()
</script>

<template>
  <div class="page-header__toolbar">
    <form
        class="search"
        @submit.prevent="loadHierarchy"
    >
      <input
          v-model="rootKey"
          class="toolbar-control toolbar-control--search"
          placeholder="e.g. MD-123"
      >

      <select
          v-model="selectedSprint"
          class="toolbar-control"
      >
        <option :value="null">
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

      <select
          v-model="selectedLabel"
          class="toolbar-control"
      >
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

      <button class="toolbar-button">
        Load
      </button>
    </form>
  </div>
</template>

<style scoped>
.page-header__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  padding: 14px 24px;

  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.toolbar-control {
  height: 38px;

  padding: 0 12px;

  font: inherit;

  background: #fff;
  color: #1f2937;

  border: 1px solid #cbd5e1;
  border-radius: 6px;

  outline: none;

  transition: border-color 0.15s ease,
  box-shadow 0.15s ease;
}

.toolbar-control:focus {
  border-color: #64748b;
  box-shadow: 0 0 0 3px rgb(100 116 139 / 12%);
}

.toolbar-control--search {
  width: 260px;
}

select.toolbar-control {
  min-width: 190px;
}

.toolbar-button {
  height: 38px;

  padding: 0 18px;

  font: inherit;
  font-weight: 600;

  color: #fff;
  background: #1f2937;

  border: 0;
  border-radius: 6px;

  cursor: pointer;

  transition: background 0.15s ease,
  transform 0.05s ease;
}

.toolbar-button:hover {
  background: #374151;
}

.toolbar-button:active {
  transform: translateY(1px);
}

.search {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
}

.search input {
  width: 250px;
}

.search button {
  padding: 8px 16px;
}
</style>