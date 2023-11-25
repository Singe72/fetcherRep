import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let data = null;
    let singleReportData = null;
    let cursor = "";
    let iteration = 0;
    let onlyFirst = false;

    let sync = await prisma.synchronisation.findFirst({});

    if(!sync){
        sync = await prisma.synchronisation.create({data: {
            is_synchronising: true
        }});

        let users = await prisma.user.findMany({});

        const notification = await prisma.notification.create({
            data: {
                notification_message: "A synchronisation has been launched",
                notification_name: "Starting a synchronisation",
            }
        });

        users.map(async (user) => {
            await prisma.user_Notification.create({
                data: {
                    user_notification_notification_id: notification.notification_id,
                    user_notification_user_id: user.user_id
                }
            });
        });
    } else {
        if(sync.is_synchronising){
            let error_response = {
                status: "error",
                message: "Synchronisation is already in progress...",
            };
            return new NextResponse(JSON.stringify(error_response), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        onlyFirst = true;
        await prisma.synchronisation.update({
            data: {
                is_synchronising: true
            },
            where: {
                synchronisation_id: sync.synchronisation_id
            }
        });
    }

    do {
        try {
            const res = await fetch('https://hackerone.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "operationName": "HacktivityPageQuery",
                    "variables": {
                        "querystring": "",
                        "where": {
                            "report": {
                                "disclosed_at": {
                                    "_is_null": false
                                }
                            }
                        },
                        "orderBy": null,
                        "secureOrderBy": {
                            "latest_disclosable_activity_at": {
                                "_direction": "DESC"
                            }
                        },
                        "count": 25,
                        "product_area": "hacktivity",
                        "product_feature": "overview",
                        "cursor": cursor
                    },
                    "query": "query HacktivityPageQuery($querystring: String, $orderBy: HacktivityItemOrderInput, $secureOrderBy: FiltersHacktivityItemFilterOrder, $where: FiltersHacktivityItemFilterInput, $count: Int, $cursor: String) {\n  me {\n    id\n    __typename\n  }\n  hacktivity_items(\n    first: $count\n    after: $cursor\n    query: $querystring\n    order_by: $orderBy\n    secure_order_by: $secureOrderBy\n    where: $where\n  ) {\n    ...HacktivityList\n    __typename\n  }\n}\n\nfragment HacktivityList on HacktivityItemConnection {\n  pageInfo {\n    endCursor\n    hasNextPage\n    __typename\n  }\n  edges {\n    node {\n      ... on HacktivityItemInterface {\n        id\n        databaseId: _id\n        __typename\n      }\n      __typename\n    }\n    ...HacktivityItem\n    __typename\n  }\n  __typename\n}\n\nfragment HacktivityItem on HacktivityItemUnionEdge {\n  node {\n    ... on HacktivityItemInterface {\n      id\n      type: __typename\n    }\n    ... on Undisclosed {\n      id\n      ...HacktivityItemUndisclosed\n      __typename\n    }\n    ... on Disclosed {\n      id\n      ...HacktivityItemDisclosed\n      __typename\n    }\n    ... on HackerPublished {\n      id\n      ...HacktivityItemHackerPublished\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment HacktivityItemUndisclosed on Undisclosed {\n  id\n  votes {\n    total_count\n    __typename\n  }\n  upvoted: upvoted_by_current_user\n  reporter {\n    id\n    username\n    ...UserLinkWithMiniProfile\n    __typename\n  }\n  team {\n    handle\n    name\n    medium_profile_picture: profile_picture(size: medium)\n    url\n    id\n    ...TeamLinkWithMiniProfile\n    __typename\n  }\n  latest_disclosable_action\n  latest_disclosable_activity_at\n  requires_view_privilege\n  total_awarded_amount\n  currency\n  __typename\n}\n\nfragment TeamLinkWithMiniProfile on Team {\n  id\n  handle\n  name\n  __typename\n}\n\nfragment UserLinkWithMiniProfile on User {\n  id\n  username\n  __typename\n}\n\nfragment HacktivityItemDisclosed on Disclosed {\n  id\n  reporter {\n    id\n    username\n    ...UserLinkWithMiniProfile\n    __typename\n  }\n  votes {\n    total_count\n    __typename\n  }\n  upvoted: upvoted_by_current_user\n  team {\n    handle\n    name\n    medium_profile_picture: profile_picture(size: medium)\n    url\n    id\n    ...TeamLinkWithMiniProfile\n    __typename\n  }\n  report {\n    id\n    databaseId: _id\n    title\n    substate\n    url\n    report_generated_content {\n      id\n      hacktivity_summary\n      __typename\n    }\n    __typename\n  }\n  latest_disclosable_action\n  latest_disclosable_activity_at\n  total_awarded_amount\n  severity_rating\n  currency\n  __typename\n}\n\nfragment HacktivityItemHackerPublished on HackerPublished {\n  id\n  reporter {\n    id\n    username\n    ...UserLinkWithMiniProfile\n    __typename\n  }\n  votes {\n    total_count\n    __typename\n  }\n  upvoted: upvoted_by_current_user\n  team {\n    id\n    handle\n    name\n    medium_profile_picture: profile_picture(size: medium)\n    url\n    ...TeamLinkWithMiniProfile\n    __typename\n  }\n  report {\n    id\n    url\n    title\n    substate\n    __typename\n  }\n  latest_disclosable_activity_at\n  severity_rating\n  __typename\n}\n"
                }),
            });

            data = await res.json();

            if (
                data.data == null ||
                data.data.hacktivity_items == null ||
                data.data.hacktivity_items.edges.length == 0) {
                await new Promise((resolve) => {
                    setTimeout(resolve, 3000);
                });
            } else {
                for (const node of data.data.hacktivity_items.edges) {
                    let exist = await prisma.report.count({
                        where: {
                            report_id: (node.node.report.id)
                        }
                    });

                    if (exist === 0) {
                        console.log("node", node.node.databaseId);

                        try {
                            const singleReportRequest = await fetch('https://hackerone.com/graphql', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "operationName": "MetadataQuery",
                                    "variables": {
                                        "report_id": parseInt(node.node.databaseId),
                                        "reportId": parseInt(node.node.databaseId),
                                        "product_area": "reports",
                                        "product_feature": "details"
                                    },
                                    "query": "query MetadataQuery($report_id: Int!) {\n  reports(where: {id: {_eq: $report_id}}) {\n    edges {\n      node {\n        id\n        closed_at\n        ...MetadataSidebarReport\n        ...MetadataSidebarSummaryHeaderReport\n        ...CustomFieldsReport\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment MetadataSidebarReport on Report {\n  id\n  database_id: _id\n  team {\n    id\n    handle\n    __typename\n  }\n  ...CampaignItemReport\n  ...ReportSeverityItemReport\n  ...ResolutionTargetItemReport\n  ...ScopeItemReport\n  ...ReportMetadataItemReport\n  ...WeaknessItemReport\n  ...BountyAmountReport\n  ...ClonedFromItemReport\n  ...CveItemReport\n  ...CredentialAccountDetailsItemReport\n  ...LinkSharingItemReport\n  ...ReportReferencesItemReport\n  ...VisibilityItemReport\n  ...DisclosureInfoItemReport\n  ...AssignedToItemReport\n  ...SubscriptionToggleReport\n  ...ClonesItemReport\n  ...DuplicatesItemReport\n  __typename\n}\n\nfragment ReportSeverityItemReport on Report {\n  id\n  i_can_create_severity\n  severity {\n    id\n    rating\n    score\n    __typename\n  }\n  __typename\n}\n\nfragment ResolutionTargetItemReport on Report {\n  id\n  substate\n  timer_report_resolved_miss_at\n  team {\n    id\n    handle\n    __typename\n  }\n  __typename\n}\n\nfragment ScopeItemReport on Report {\n  id\n  database_id: _id\n  i_can_change_structured_scope\n  structured_scope {\n    id\n    asset_type\n    asset_identifier\n    __typename\n  }\n  team {\n    id\n    handle\n    offers_bounties\n    __typename\n  }\n  __typename\n}\n\nfragment ReportMetadataItemReport on Report {\n  id\n  report_metadata {\n    id\n    time_spent\n    __typename\n  }\n  __typename\n}\n\nfragment WeaknessItemReport on Report {\n  id\n  database_id: _id\n  i_can_change_weakness\n  team {\n    id\n    handle\n    __typename\n  }\n  weakness {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment BountyAmountReport on Report {\n  id\n  bounties {\n    total_awarded_amount\n    __typename\n  }\n  team {\n    id\n    currency\n    __typename\n  }\n  __typename\n}\n\nfragment ClonedFromItemReport on Report {\n  id\n  cloned_from {\n    id\n    database_id: _id\n    __typename\n  }\n  __typename\n}\n\nfragment CveItemReport on Report {\n  id\n  database_id: _id\n  cve_ids\n  is_external_bug\n  i_am_organization_group_member\n  team {\n    id\n    ...CveEditModalTeam\n    __typename\n  }\n  __typename\n}\n\nfragment CveEditModalTeam on Team {\n  id\n  handle\n  i_can_create_cve_request\n  is_team_member\n  __typename\n}\n\nfragment CredentialAccountDetailsItemReport on Report {\n  id\n  credential {\n    id\n    account_details\n    __typename\n  }\n  __typename\n}\n\nfragment LinkSharingItemReport on Report {\n  id\n  database_id: _id\n  i_can_manage_link_sharing\n  is_link_sharing_enabled\n  __typename\n}\n\nfragment ReportReferencesItemReport on Report {\n  id\n  database_id: _id\n  is_external_bug\n  i_am_organization_group_member\n  team {\n    id\n    is_team_member\n    i_can_manage_references\n    __typename\n  }\n  ...EscalationFragment\n  __typename\n}\n\nfragment EscalationFragment on Report {\n  id\n  escalations(\n    where: {enabled: true, implementation_type: {_in: [\"ManualEscalation\", \"TrayEscalation\", \"JiraEscalation\", \"Salesforce::AgileAcceleratorEscalation\", \"PhabricatorEscalation\"]}}\n    first: 1\n    order_by: {created_at: {_direction: DESC}}\n  ) {\n    edges {\n      node {\n        id\n        implementation {\n          __typename\n          ... on ManualEscalation {\n            id\n            __typename\n            url\n            reference\n            source {\n              id\n              name\n              __typename\n            }\n          }\n          ... on TrayEscalation {\n            id\n            __typename\n            url\n            reference\n            solution_instance {\n              id\n              name\n              __typename\n            }\n          }\n          ... on JiraEscalation {\n            id\n            __typename\n            url\n            reference\n          }\n          ... on AgileAcceleratorEscalation {\n            id\n            __typename\n            url\n            reference\n          }\n          ... on PhabricatorEscalation {\n            id\n            __typename\n            url\n            reference\n          }\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment VisibilityItemReport on Report {\n  id\n  database_id: _id\n  visibility\n  bug_reporter_agreed_on_going_public_at\n  team_member_agreed_on_going_public_at\n  i_can_redact\n  disclosed_at\n  hacker_published\n  i_can_hide_timeline\n  summaries {\n    id\n    category\n    content\n    __typename\n  }\n  __typename\n}\n\nfragment DisclosureInfoItemReport on Report {\n  id\n  singular_disclosure_disabled\n  allow_singular_disclosure_at\n  allow_singular_disclosure_after\n  disclosed_at\n  hacker_published\n  __typename\n}\n\nfragment AssignedToItemReport on Report {\n  id\n  database_id: _id\n  i_am_organization_group_member\n  team {\n    id\n    is_team_member\n    __typename\n  }\n  assignee {\n    ... on User {\n      id\n      username\n      url\n      type: __typename\n    }\n    ... on TeamMemberGroup {\n      id\n      name\n      type: __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment SubscriptionToggleReport on Report {\n  id\n  i_am_subscribed\n  i_can_change_subscription\n  __typename\n}\n\nfragment ClonesItemReport on Report {\n  id\n  i_can_clone\n  team {\n    id\n    database_id: _id\n    __typename\n  }\n  clones {\n    edges {\n      node {\n        id\n        database_id: _id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment DuplicatesItemReport on Report {\n  id\n  duplicates {\n    edges {\n      node {\n        id\n        database_id: _id\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment CampaignItemReport on Report {\n  id\n  campaign {\n    id\n    ...CampaignFragment\n    __typename\n  }\n  team {\n    id\n    handle\n    __typename\n  }\n  __typename\n}\n\nfragment CampaignFragment on Campaign {\n  id\n  campaign_type\n  start_date\n  end_date\n  critical\n  high\n  medium\n  low\n  researchers_information\n  target_audience\n  bounty_table_row {\n    id\n    critical\n    high\n    medium\n    low\n    __typename\n  }\n  campaign_objective {\n    id\n    _id\n    name\n    description\n    category\n    key\n    __typename\n  }\n  structured_scopes {\n    nodes {\n      id\n      asset_identifier\n      asset_type\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MetadataSidebarSummaryHeaderReport on Report {\n  id\n  database_id: _id\n  team {\n    id\n    handle\n    __typename\n  }\n  ...ReportedAtReport\n  ...ReporterReport\n  ...ReportedToReport\n  ...ReportIdAndStateItemReport\n  ...ParticipantsReport\n  ...InboxesReport\n  ...FindReportDuplicatesItem\n  __typename\n}\n\nfragment ReportedAtReport on Report {\n  id\n  submitted_at\n  created_at\n  __typename\n}\n\nfragment ReporterReport on Report {\n  id\n  reporter {\n    id\n    username\n    profile_picture(size: small)\n    __typename\n  }\n  __typename\n}\n\nfragment ReportedToReport on Report {\n  id\n  campaign {\n    id\n    __typename\n  }\n  can_manage\n  team {\n    id\n    handle\n    name\n    type\n    triage_active\n    pentest_feature_enabled\n    profile_picture(size: medium)\n    __typename\n  }\n  __typename\n}\n\nfragment ReportIdAndStateItemReport on Report {\n  id\n  _id\n  disclosed_at\n  original_report {\n    id\n    _id\n    url\n    substate\n    submitted_at\n    __typename\n  }\n  state\n  substate\n  title\n  bug_reporter_agreed_on_going_public_at\n  singular_disclosure_disabled\n  team_member_agreed_on_going_public_at\n  __typename\n}\n\nfragment ParticipantsReport on Report {\n  id\n  can_manage\n  i_can_manage_collaborators\n  __typename\n}\n\nfragment InboxesReport on Report {\n  id\n  can_change_organization_inboxes\n  organization_inboxes {\n    nodes {\n      id\n      database_id: _id\n      handle\n      name\n      inbox_type\n      __typename\n    }\n    __typename\n  }\n  organization {\n    id\n    features {\n      id\n      key\n      enabled\n      __typename\n    }\n    organization_inboxes {\n      nodes {\n        id\n        database_id: _id\n        handle\n        name\n        inbox_type\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment FindReportDuplicatesItem on Report {\n  id\n  i_can_view_duplicate_suggestions\n  __typename\n}\n\nfragment CustomFieldsReport on Report {\n  id\n  database_id: _id\n  i_can_view_hacker_facing_custom_fields\n  i_can_update_custom_field_values\n  i_am_organization_group_member\n  team {\n    id\n    handle\n    i_can_manage_custom_fields\n    is_team_member\n    __typename\n  }\n  internal_custom_fields: custom_fields(where: {internal: {_eq: true}}) {\n    total_count\n    edges {\n      node {\n        id\n        internal\n        label\n        value\n        archived_at\n        type: field_type\n        checkbox_text\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  hacker_facing_custom_fields: custom_fields(where: {internal: {_eq: false}}) {\n    total_count\n    edges {\n      node {\n        id\n        internal\n        label\n        value\n        archived_at\n        type: field_type\n        checkbox_text\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
                                }),
                            });

                            singleReportData = await singleReportRequest.json();
                            let weakness = null;
                            if (
                                singleReportData.data != null &&
                                singleReportData.data.reports != null &&
                                singleReportData.data.reports.edges.length != 0 &&
                                singleReportData.data.reports.edges[0].node != null) {
                                weakness = singleReportData.data.reports.edges[0].node.weakness;
                            }

                            await prisma.report.create({
                                data: {
                                    report_id: node.node.report.id,
                                    report_program: (node.node.team != null) ? node.node.team.name : null,
                                    report_title: node.node.report.title,
                                    report_weakness: (weakness != null) ? weakness.name : null,
                                    report_severity: (node.node.severity_rating) ? node.node.severity_rating : "none",
                                    report_h1_id: parseInt(node.node.databaseId),
                                    report_reward: node.node.total_awarded_amount
                                }
                            });
                        } catch(error: any){
                            console.log(error.toString());
                        }
                    }
                }

                cursor = data.data.hacktivity_items.pageInfo.endCursor;
                iteration++;
            }
        } catch(error: any){
            console.log(error.toString());
        }
    } while(data.data.hacktivity_items.pageInfo.hasNextPage && !onlyFirst);

    await prisma.synchronisation.update({
        data: {
            is_synchronising: false
        },
        where: {
            synchronisation_id: sync.synchronisation_id
        }
    });

    let users = await prisma.user.findMany({});

    const notification = await prisma.notification.create({
        data: {
            notification_message: "A synchronisation has been performed",
            notification_name: "New synchronisation",
        }
    });

    users.map(async (user) => {
        await prisma.user_Notification.create({
            data: {
                user_notification_notification_id: notification.notification_id,
                user_notification_user_id: user.user_id
            }
        });
    })

    let error_response = {
        status: "success",
        message: "the synchronization has been carried out correctly"
    };

    return new NextResponse(JSON.stringify(error_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}