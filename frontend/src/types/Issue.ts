export interface Issue {
    key: string
    summary: string
    status: IssueStatus
    issueType: string
    timespent: string | null
    timetracking: TimeTracking
    labels: string[]
    sprint: Sprint
    assignee: IssueAssignee
    children: Issue[]
}

export interface TimeTracking {
    originalEstimate: string,
    remainingEstimate: string,
    timeSpent: string,
    originalEstimateSeconds: number,
    remainingEstimateSeconds: number,
    timeSpentSeconds: number,
}

export interface Sprint {
    id: number,
    name: string,
    state: string,
    boardId: number,
    goal: string,
    startDate: string
    endDate: string
}

export interface IssueStatus {
    id: number,
    name: string,
    statusCategory: IssueStatusCategory,
}
export interface IssueStatusCategory {
    id: number,
    name: string,
    key:string,
    colorName:string
}

export interface IssueAssignee {
    self: string,
    accountId: string,
    emailAddress: string,
    displayName: string,
    active: boolean,
    timeZone: string,
    accountType: string,
}
