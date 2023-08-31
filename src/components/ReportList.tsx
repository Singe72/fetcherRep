"use client";

import React, {useEffect, useState} from "react";
import { apiFetchReports } from "@/lib/api-requests";
import { useReportStore } from "@/store";
import toast from "react-hot-toast";
import Link from "next/link";
import ModifyReport from "@/components/ModifyReport";
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog'
import {IReport} from "@/lib/types";

const FeedbackList: React.FC = () => {
	const [show, setShow] = useState(false);
	const [report, setReport] = useState(null as IReport|null);

	const handleClose = () => {
		setShow(false);
		setReport(null);
	}
	const handleShow = (report: IReport) => {
		setShow(true);
		setReport(report);
	}

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
							<button onClick={() => handleShow(report)} className={"btn btn-transparant"} >
								<span className="material-symbols-outlined">
									edit
								</span>
							</button>
						</td>
					</tr>
				</>
			))}

			<Modal show={show} onHide={() => handleClose()} dialogClassName="modal-70w">
				<Modal.Header closeButton className={"bg-dark text-white"} closeVariant={"white"}>
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>
				<Modal.Body className={"bg-dark text-white"}>
					<ModifyReport report_id={report?.report_id} />
				</Modal.Body>
			</Modal>
		</>
	);
};

export default FeedbackList;
