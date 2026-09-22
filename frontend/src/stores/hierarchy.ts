// stores/hierarchy.ts

import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

import type {Issue} from '@/types/Issue'
import {
    collectLabels,
    collectSprints,
    collectAssignees,
    filterTree,
} from '@/domain/hierarchy'

export const useHierarchyStore = defineStore('hierarchy', () => {
    const hierarchy = ref<Issue | null>(null)

    const rootKey = ref('MD-3008')

    const selectedSprint = ref<number | null>(null)
    const selectedLabel = ref<string | null>(null)
    const selectedAssignee = ref<string | null>(null)

    const loading = ref(false)
    const error = ref<string | null>(null)

    const availableLabels = computed(() => {
        if (!hierarchy.value) {
            return []
        }

        return [
            ...new Set(collectLabels(hierarchy.value)),
        ].sort()
    })

    const availableSprints = computed(() => {
        if (!hierarchy.value) {
            return []
        }

        return [
            ...new Map(
                collectSprints(hierarchy.value)
                    .map(sprint => [sprint.id, sprint]),
            ).values(),
        ]
    })

    const availableAssignees = computed(() => {
        if (!hierarchy.value) {
            return []
        }

        return [
            ...new Map(
                collectAssignees(hierarchy.value)
                    .map(assignee => [assignee.accountId, assignee]),
            ).values(),
        ]
    })

    const filteredHierarchy = computed(() => {
        console.log('filteredHierarchy', hierarchy.value)
        if (!hierarchy.value) {
            return null
        }

        console.log('filters: ', selectedSprint.value, selectedLabel.value)
        const result = filterTree(
            hierarchy.value,
            selectedSprint.value,
            selectedLabel.value,
            selectedAssignee.value,
        )
        console.log(result)
        return result
    })

    async function loadHierarchy() {
        if (!rootKey.value) {
            return
        }

        loading.value = true
        error.value = null

        try {
            const response = await fetch(
                `/api/hierarchy/${rootKey.value}`,
            )

            if (!response.ok) {
                throw new Error(
                    `Request failed: ${response.status}`,
                )
            }

            hierarchy.value = await response.json()
        } catch (err) {
            error.value =
                err instanceof Error
                    ? err.message
                    : 'Unknown error'
        } finally {
            loading.value = false
        }
    }

    return {
        hierarchy,
        rootKey,

        selectedSprint,
        selectedLabel,
        selectedAssignee,

        availableSprints,
        availableLabels,
        availableAssignees,
        filteredHierarchy,

        loading,
        error,

        loadHierarchy,
    }
})