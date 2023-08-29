"use client";

import React, { useEffect } from "react";
import { apiFetchReports } from "@/lib/api-requests";
import { useReportStore } from "@/store";
import toast from "react-hot-toast";
import Link from "next/link";

const FeedbackList: React.FC = () => {
	const store = useReportStore();
	const reportList = store.reports;

	function numberWithSpaces(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}

	type tbgBySeverity = {
		[key: string]: string
	}

	const bgBySeverity: tbgBySeverity = {
		low: "bg-info text-dark",
		medium: "bg-warning text-dark",
		high: "bg-primary text-dark",
		critical: "bg-danger text-dark"
	}
	const fetchReports = async () => {
		store.setPageLoading(true);

		try {
			const reports = await apiFetchReports();

			store.setReportList(
				reports.sort(
					(a, b) => {
						if(a.report_state > b.report_state){
							return 1;
						} else {
							return -1;
						}
					}
				)
			);
		} catch (error: any) {
			toast.error(error.toString());
		}

		store.setPageLoading(false);
	};

	useEffect(() => {
		fetchReports();
		window.addEventListener("focus", fetchReports);
		return () => {
			window.removeEventListener("focus", fetchReports);
		};
	}, []);

	return (
		<>
			{reportList.map(report => (
				<>
					<tr>
						<td>
							{(report.report_state == "new") ?
								<div
									className={`bg-success rounded-circle`}
									style={{width: "25px", height: "25px"}}></div>
								:
								<div
									className={`bg-primary rounded-circle`}
									style={{width: "25px", height: "25px"}}></div>
							}
						</td>
						<td>
							{(report.report_severity != null) ?
								<span className={`badge ${bgBySeverity[report.report_severity!]} badge-pill`}>{report.report_severity}</span>
								:
								report.report_severity
							}
						</td>
						<td>{report.report_program}</td>
						<td>{report.report_title}</td>
						<td>
							{(report.report_reward != null) ?
								numberWithSpaces(report.report_reward) + "$"
								:
								""
							}
						</td>
						<td>
							<Link className={"btn btn-transparant"} href={`/report/${report.report_id}`}>
								<span className="material-symbols-outlined">
									edit
								</span>
							</Link>
						</td>
					</tr>
				</>
			))}
		</>
	);
};

export default FeedbackList;
