import type {Issue, IssueAssignee, Sprint} from "@/types/Issue.ts";
import type {AssigneePlanning} from "@/types/AssigneePlanning.ts";

export function collectLabels(issue: Issue): string[] {
  return [
    ...issue.labels,
    ...issue.children.flatMap(collectLabels),
  ]
}

export function collectSprints(issue: Issue): Sprint[] {
  return [
    ...(issue.sprint ? [issue.sprint] : []),
    ...issue.children.flatMap(collectSprints),
  ]
}

export function collectAssignees(issue: Issue): IssueAssignee[] {
  return [
    ...(issue.assignee ? [issue.assignee] : []),
    ...issue.children.flatMap(collectAssignees),
  ]
}

export function filterTree(
  issue: Issue,
  sprint: number | null,
  label: string | null,
  assignee: string | null
): Issue | null {
  if (isSubtreeDone(issue)) {
    return null
  }

  const filteredChildren = issue.children
    .map(child => filterTree(child, sprint, label, assignee))
    .filter((child): child is Issue => child !== null)

  const matchesSprint =
    !sprint || issue.sprint?.id === sprint

  const matchesLabel =
    !label || issue.labels.includes(label)

  const matchesAssignee =
      !assignee || issue?.assignee?.accountId === assignee

  const matchesFilters =
    matchesSprint && matchesLabel && matchesAssignee

  if (!matchesFilters && filteredChildren.length === 0) {
    return null
  }

  return {
    ...issue,
    children: filteredChildren,
  }
}

function isSubtreeDone(issue: Issue): boolean {
  return (
    issue.status.statusCategory.key === 'done' &&
    issue.children.every(isSubtreeDone)
  )
}

export function collectPlanningByAssignee(
    issue: Issue,
    sprintId: number | null,
    label: string | null,
    result = new Map<string, AssigneePlanning>(),
): Map<string, AssigneePlanning> {
  console.log('collect planning by assignee')
  const matchesSprint =
      sprintId === null ||
      issue.sprint?.id === sprintId

  const matchesLabel =
      label === null ||
      issue.labels.includes(label)

  const matchesFilters =
      matchesSprint && matchesLabel

  if (matchesFilters && issue.assignee) {
    const current = result.get(issue.assignee.accountId) ?? {
      assignee: issue.assignee,
      estimatedSeconds: 0,
      issueCount: 0,
    }

    current.estimatedSeconds += issue.timetracking.remainingEstimateSeconds ?? 0
    current.issueCount += 1

    result.set(issue.assignee.accountId, current)
  }

  for (const child of issue.children) {
    collectPlanningByAssignee(
        child,
        sprintId,
        label,
        result,
    )
  }

  return result
}

export function getPlanningByAssignee(
    issue: Issue,
    sprintId: number | null,
    label: string | null,
): AssigneePlanning[] {
  return [
    ...collectPlanningByAssignee(
        issue,
        sprintId,
        label,
    ).values(),
  ].sort(
      (a, b) =>
          b.estimatedSeconds - a.estimatedSeconds,
  )
}