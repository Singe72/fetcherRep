/**
 * USER
 */

export interface FilteredUser {
    user_id: string;
    user_username: string;
    user_email: string;
    user_createdAt: string;
    user_updatedAt: string;
}

export interface UserResponse {
    status: string;
    data: {
        user: FilteredUser;
    };
}

export interface UserLoginResponse {
    status: string;
    token: string;
}

/**
 * REPORTS
 */

export interface ReportsFetchResponse {
    status: string;
    results: number;
    reports: IReport[];
}

export interface ReportFetchResponse {
    status: string;
    report: IReport;
}

export interface ReportUpdateRequest {
    report: {
        report_id: string;
        report_top_report: boolean;
        report_disclosure: boolean;
        report_weakness: string;
        report_comment: string;
    },
    vulnerability: {
        value: string;
        label: string;
        __isNew__?: boolean;
    }[]
}

export interface ReportUpdateResponse {
    status: string;
    message?: string;
    report?: IReport;
}

/**
 * VULNERABILITIES
 */

export interface VulnerabilitiesFetchResponse {
    status: string;
    results: number;
    vulnerabilities: IVulnerability[];
}

/**
 * SYNC
 */

export interface SynchronisationResponse {
    is_synchronising: boolean;
}

/**
 * STATISTICS
 */

export interface StatisticsResponse {
    statistics: Statistics
}

export interface IReport {
    report_id: string;
    report_title: string;
    report_h1_id: number|null;
    report_program: string|null;
    report_severity: string|null;
    report_reward: number|null;
    report_disclosure: boolean;
    report_weakness: string;
    report_top_report: boolean;
    report_comment: string;
    report_state: string;
    report_vulnerabilities: IReport_Vulnerability[];
}

export interface IReport_Vulnerability {
    report_vulnerability_report_id: string;
    report_vulnerability_vulnerability_id: number;
    vulnerability: IVulnerability
}

export interface IVulnerability {
    vulnerability_id: number;
    vulnerability_name: string;
}

export interface SelectProps {
    options: {
        value: string;
        label: string;
    }[];
}

export interface Statistics {
    nb_report: number,
    nb_new_report: number,
    nb_programs: number,
    max_reward: number
}