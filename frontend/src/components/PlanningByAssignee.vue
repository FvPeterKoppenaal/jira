<script setup lang="ts">
import {storeToRefs} from 'pinia'

import {useHierarchyStore} from '@/stores/hierarchy'

const store = useHierarchyStore()

const {
  planningByAssignee
} = storeToRefs(store)

function formatHours(seconds: number): string {
  return `${(seconds / 3600).toFixed(1)} uur`
}
</script>

<template>
<!--  jalalalala-->
<!--  <pre>{{ planningByAssignee }}</pre>-->
  <div
      v-if="planningByAssignee"
      class="planning-overview"
  >
    <div
        v-for="person in planningByAssignee"
        :key="person.assignee.accountId"
        class="planning-person"
    >
      <strong>
        {{ person.assignee.displayName }}
      </strong>

      <span>
      {{ formatHours(person.estimatedSeconds) }}
    </span>

      <small>
        {{ person.issueCount }} issues
      </small>
    </div>
  </div>
</template>
<style lang="css" scoped>
.planning-overview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  margin-top: 2.5rem;
}

.planning-person {
  display: grid;
  gap: 4px;

  min-width: 180px;
  padding: 12px 16px;

  border: 2px solid #2f5527;
  border-radius: 6px;
}

.planning-person strong {
  font-size: 14px;
}

.planning-person span {
  font-size: 20px;
  font-weight: 600;
}

.planning-person small {
  color: #666;
}
</style>