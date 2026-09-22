import type {IssueAssignee} from "@/types/Issue.ts";

export interface AssigneePlanning {
    assignee: IssueAssignee
    estimatedSeconds: number
    issueCount: number
}