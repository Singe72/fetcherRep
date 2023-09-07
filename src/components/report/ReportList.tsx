"use client";

import React, {useEffect, useState} from "react";
import { apiFetchReports } from "@/lib/api-requests";
import { useReportStore } from "@/store";
import toast, {Toaster} from "react-hot-toast";
import Link from "next/link";
import ModifyReport from "@/components/report/ModifyReport";
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog'
import {IReport} from "@/lib/types";
import Synchronisation from "@/components/Synchronisation";
import statistics from "@/components/Statistics";
import ReactCreatableSelectInput from "@/components/inputs/ReactCreatableSelectInput";
import ReactSelectInput from "@/components/inputs/ReactSelectInput";
import {FormProvider, useForm} from "react-hook-form";
import {ModifyReportInput, ModifyReportSchema} from "@/lib/validations/report.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {FilterInput, FilterSchema} from "@/lib/validations/filter.schema";
import FormInput from "@/components/inputs/FormInput";

const ReportList: React.FC = () => {
	const [show, setShow] = useState(false);
	const [report, setReport] = useState(null as IReport|null);
	const [maxPage, setMaxPage] = useState(1);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(50);
	const [name, setName] = useState("");
	const [stateValues, setStateValues] = useState([{
		value: "new",
		label: "New"
	}] as {value: string, label: string}[]);
	const [severityValues, setSeverityValues] = useState([
		{
			value: "medium",
			label: "medium"
		},
		{
			value: "high",
			label: "high"
		},
		{
			value: "low",
			label: "low"
		},
		{
			value: "critical",
			label: "critical"
		},
		{
			value: "none",
			label: "none"
		},
	] as {value: string, label: string}[]);
	const methods = useForm();

	const stateOptions = [
		{
			value: "new",
			label: "New"
		},
		{
			value: "processed",
			label: "Processed"
		}
	];

	const severityOptions = severityValues;

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

	const changeLimit = (event: any) => {
		let limit = Number(event.target.value);
		if(limit < 1) limit = 1;
		if(limit > 200) limit = 200;

		setLimit(limit);

		event.target.value = limit;
	}

	const changeName = (event: any) => {
		let name = event.target.value;

		setName(event.target.value);

		event.target.value = name;
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
			const reportsData = await apiFetchReports(
				page,
				limit,
				name,
				stateValues.map((state) => state.value),
				severityValues.map((severity) => severity.value)
			);
			const reports = reportsData.reports;

			console.log(reportsData.results, limit);

			setMaxPage(Math.ceil(reportsData.results / limit));

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
	}, [page, limit, name, stateValues, severityValues]);

	if(reportList == null){
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
	} else if(reportList.length == 0){
		return (
			<>
				<Toaster />
				<div className="card mb-4 mt-4">
					<div className="card-header justify-content-between align-items-center d-flex">
						<h6 className="card-title m-0">Reports</h6>
						<Synchronisation />
					</div>
					<div className={"container-fluid d-flex gap-2 mt-2 mb-2"}>
						<FormProvider {...methods}>
							<div className={"form-group"}>
								<label htmlFor={"limit"} className={"text-white"}>Limit</label>
								<input
									id="limit"
									type={"number"}
									className={"form-control bg-dark text-white"}
									defaultValue={limit}
									onBlur={(event) => changeLimit(event)}
								/>
							</div>
							<ReactSelectInput
								label={"State"}
								name={"state"}
								multi={true}
								options={stateOptions}
								values={stateValues}
								setValues={setStateValues}
							/>
							<ReactSelectInput
								label={"Severity"}
								name={"severity"}
								multi={true}
								options={severityOptions}
								values={severityValues}
								setValues={setSeverityValues}
							/>
							<div className={"form-group"}>
								<label htmlFor={"limit"} className={"text-white"}>Name</label>
								<input
									id="name"
									type={"text"}
									className={"form-control bg-dark text-white"}
									defaultValue={name}
									onBlur={(event) => changeName(event)}
								/>
							</div>
						</FormProvider>
					</div>
					<div className={"container-fluid mt-2 mb-2"}>
						<p className={"text-center"}>Pas de rapports enregistrés.. Commencer par effectuer une synchronisation</p>
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
					<FormProvider {...methods}>
						<div className={"form-group"}>
							<label htmlFor={"limit"} className={"text-white"}>Limit</label>
							<input
								id="limit"
								type={"number"}
								className={"form-control bg-dark text-white"}
								defaultValue={limit}
								onBlur={(event) => changeLimit(event)}
							/>
						</div>
						<ReactSelectInput
							label={"State"}
							name={"state"}
							multi={true}
							options={stateOptions}
							values={stateValues}
							setValues={setStateValues}
						/>
						<ReactSelectInput
							label={"Severity"}
							name={"severity"}
							multi={true}
							options={severityOptions}
							values={severityValues}
							setValues={setSeverityValues}
						/>
						<div className={"form-group"}>
							<label htmlFor={"limit"} className={"text-white"}>Name</label>
							<input
								id="name"
								type={"text"}
								className={"form-control bg-dark text-white"}
								defaultValue={name}
								onBlur={(event) => changeName(event)}
							/>
						</div>
					</FormProvider>
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
					<div className={"container-fluid d-flex justify-content-between gap-2 mt-2 mb-2"}>
						<span>Page {page}/{maxPage}</span>
						<div>
							<button
								type={"button"}
								className={"btn btn-primary btn-sm"}
								onClick={previousPage}
								disabled={(page == 1)}>
								<span className="material-symbols-outlined">
									chevron_left
								</span>
							</button>
							<button
								type={"button"}
								className={"btn btn-primary btn-sm ms-2"}
								onClick={nextPage}
								disabled={(page == maxPage)}
							>
								<span className="material-symbols-outlined">
									chevron_right
								</span>
							</button>
						</div>
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

export default ReportList;
