"use client";

import React, {useEffect, useState} from "react";
import { apiFetchReports } from "@/lib/api-requests";
import { useReportStore } from "@/store";
import toast, {Toaster} from "react-hot-toast";
import Link from "next/link";
import ModifyReport from "@/components/ModifyReport";
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog'
import {IReport} from "@/lib/types";
import Synchronisation from "@/components/Synchronisation";
import statistics from "@/components/Statistics";

const FeedbackList: React.FC = () => {
	const [show, setShow] = useState(false);
	const [report, setReport] = useState(null as IReport|null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);

	const handleClose = () => {
		setShow(false);
		setReport(null);
	}
	const handleShow = (report: IReport) => {
		setShow(true);
		setReport(report);
	}

	const handleSubmit = () => {
		handleClose();
		fetchReports();
		toast.success("Report has been udpated successfully!");
	}

	const nextPage = () => {
		setPage(page + 1);
	}
	const previousPage = () => {
		if(page > 1) {
			setPage(page - 1);
		}
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
			const reports = await apiFetchReports(page, limit);

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
	}, [page, limit]);

	if(reportList.length == 0){
		return (
			<>
				<div className="card mb-4 mt-4">
					<div className={"d-flex justify-content-center align-items-center w-100 h-100 p-4"}>
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<Toaster />
			<div className="card mb-4 mt-4">
				<div className="card-header justify-content-between align-items-center d-flex">
					<h6 className="card-title m-0">Reports</h6>
					<Synchronisation />
				</div>
				<div className={"container-fluid d-flex gap-2 mt-2 mb-2"}>
					<div className={"form-floating"}>
						<input id="limit" type={"number"} className={"form-control bg-dark text-white"} defaultValue={limit} />
						<label htmlFor={"limit"}>Limit</label>
					</div>
				</div>
				<div className="card-body">
					<table className="table">
						<thead>
						<tr>
							<th scope="col">New?</th>
							<th scope="col">Severity</th>
							<th scope="col">Program</th>
							<th scope="col">Title</th>
							<th scope="col">Reward</th>
							<th scope="col">Action</th>
						</tr>
						</thead>
						<tbody>
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
						</tbody>
					</table>
					<div className={"container-fluid d-flex justify-content-end gap-2 mt-2 mb-2"}>
						<button type={"button"} className={"btn btn-primary btn-sm"} onClick={previousPage}>
							<span className="material-symbols-outlined">
								chevron_left
							</span>
						</button>
						<button type={"button"} className={"btn btn-primary btn-sm"} onClick={nextPage}>
							<span className="material-symbols-outlined">
								chevron_right
							</span>
						</button>
					</div>
				</div>
			</div>


			<Modal show={show} onHide={() => handleClose()} dialogClassName="modal-70w">
				<Modal.Header closeButton className={"bg-dark text-white"} closeVariant={"white"}>
					<Modal.Title>Modify a report</Modal.Title>
				</Modal.Header>
				<Modal.Body className={"bg-dark text-white"}>
					{report != null ?
						<ModifyReport report_id={report.report_id} callback={() => handleSubmit()} />
						:
						<></>
					}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default FeedbackList;
