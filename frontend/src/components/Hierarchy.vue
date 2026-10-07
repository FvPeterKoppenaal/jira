<script setup lang="ts">
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
  --tree-columns: 24px 100px minmax(260px, 1fr) 100px 140px 150px repeat(3, 100px) 150px 150px;
  --tree-width: 1570px;
  min-width: 0;
  overflow-x: auto;
  border: 1px solid #2f5527;
  border-radius: 6px;
}

.header {
  display: grid;
  grid-template-columns: var(--tree-columns);
  min-width: var(--tree-width);
  box-sizing: border-box;

  gap: 8px;
  padding: 8px;

  font-weight: bold;
  border-bottom: 1px solid #2f5527;
}

@media (max-width: 800px) {
  .tree {
    --tree-width: 0px;
  }

  .header {
    display: none;
  }
}
</style>
