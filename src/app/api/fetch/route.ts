import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    let data = null;
    let cursor = "";
    let iteration = 0;

    do {
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
        })

        data = await res.json();

        for(const node of data.data.hacktivity_items.edges){
            const exist = await prisma.report.count({
                where: {
                    report_id: (node.node.report.id)
                }
            });

            if(exist === 0) {
                await prisma.report.create({
                    data: {
                        report_id: node.node.report.id,
                        report_program: (node.node.team != null) ? node.node.team.name : null,
                        report_title: node.node.report.title,
                        report_severity: node.node.severity_rating,
                        report_h1_id: parseInt(node.node.databaseId),
                        report_reward: node.node.total_awarded_amount
                    }
                });
            }
        }

        cursor = data.data.hacktivity_items.pageInfo.endCursor;
        iteration++;
    } while(data.data["hacktivity_items"]["pageInfo"]["hasNextPage"]);

    return NextResponse.json({"nombre de pages" : (iteration-1)});
}