<script setup lang="ts">
import {ref} from 'vue'
import type {Issue} from "@/types/Issue.ts";
import IssueTree from "@/components/IssueTree.vue";

withDefaults(
    defineProps<{
      hierarchy: Issue |null
      depth?: number
    }>(),
    {
      depth: 0,
    },
)

const expanded = ref(true)
</script>

<template>
  <div
      v-if="hierarchy"
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

    <IssueTree :issue="hierarchy"/>
  </div>
</template>

<style scoped>
.tree {
  overflow-x: auto;
  border: 1px solid #2f5527;
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
  border-bottom: 1px solid #2f5527;
}
</style>