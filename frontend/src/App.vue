<script setup lang="ts">
import {storeToRefs} from 'pinia'
import IssueTree from '@/components/IssueTree.vue'
import PlanningByAssignee from '@/components/PlanningByAssignee.vue'
import Hierarchy from '@/components/Hierarchy.vue'

import {useHierarchyStore} from '@/stores/hierarchy'
import Toolbar from "@/components/Toolbar.vue";

const store = useHierarchyStore()

const {
  filteredHierarchy,
  loading,
  error,
} = storeToRefs(store)

</script>

<template>
  <header class="page-header">
    <div class="page-header__top">
      <div class="page-header__brand">
        <img
            class="page-header__logo"
            src="/assets/logo/logo.svg"
            alt="Flikweert Vision"
        >
        <h1>Jira hierarchy</h1>
      </div>
    </div>
    <toolbar :hierarchy="filteredHierarchy"/>
  </header>

  <main>
    <PlanningByAssignee/>

    <p v-if="loading">
      Loading…
    </p>

    <p
        v-if="error"
        class="error"
    >
      {{ error }}
    </p>

    <Hierarchy :hierarchy="filteredHierarchy"/>

  </main>
</template>

<style scoped>
.page-header {
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.page-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px 24px;
}

.page-header__brand {
  display: flex;
  align-items: center;
  gap: 18px;
}

.page-header__logo {
  width: 180px;
  height: auto;
  display: block;
}

.page-header h1 {
  margin: 0;

  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;

  color: #1f2937;
}

@media (max-width: 800px) {
  .page-header__top {
    padding: 16px;
  }

  .page-header__brand {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .page-header__logo {
    width: 150px;
  }
}

main {
  margin: 40px auto;
  padding: 0 24px;
}

.error {
  color: red;
}
</style>