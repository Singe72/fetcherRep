"use client";

import {
	ModifyReportSchema,
	ModifyReportInput
} from "@/lib/validations/report.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, {useEffect, useState} from "react";
import {apiFetchReport, apiFetchVulnerabilities, apiUpdateReport} from "@/lib/api-requests";
import {useReportStore} from "@/store";
import { handleApiError } from "@/lib/helpers";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {IReport, ReportUpdateRequest} from "@/lib/types";

import CheckboxInput from "@/components/inputs/CheckboxInput";
import TextareaInput from "@/components/inputs/TextareaInput";
import ReactSelectInput from "@/components/inputs/ReactSelectInput";

const ModifyReport = ({report_id, callback}: {report_id: string, callback: Function}) => {
	const store = useReportStore();
	const router = useRouter();
	const report = store.report;
	const [vulnerabilityOptions, setVulnerabilityOptions] = useState([] as {value: string, label: string}[]);
	const [vulnerabilityValues, setVulnerabilityValues] = useState([] as {value: string, label: string}[]);
	const [disclosure, setDisclosure] = useState(false);
	const [topReport, setTopReport] = useState(false);
	const methods = useForm<ModifyReportInput>({
		// @ts-ignore
		resolver: zodResolver(ModifyReportSchema),
	});

	const {
		reset,
		handleSubmit,
		formState: { isSubmitSuccessful },
	} = methods;

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSubmitSuccessful]);

	const fetchReports = async () => {
		store.setPageLoading(true);

		try {
			const report = await apiFetchReport(report_id);
			const vulnerabilities = await apiFetchVulnerabilities();

			const actualVulnerabilityOptions: {value: string, label: string}[] = [];
			const actualVulnerabilityValues: {value: string, label: string}[] = [];

			if(report.report_vulnerabilities == undefined){
				vulnerabilities.map((vulnerability) => {
					actualVulnerabilityOptions.push({
						value: vulnerability.vulnerability_id.toString(),
						label: vulnerability.vulnerability_name
					});
				});
			} else {
				vulnerabilities.map((vulnerability) => {
					if (!report.report_vulnerabilities.some(
						(value) => value.vulnerability.vulnerability_id == vulnerability.vulnerability_id
					)) {
						actualVulnerabilityOptions.push({
							value: vulnerability.vulnerability_id.toString(),
							label: vulnerability.vulnerability_name
						});
					} else {
						actualVulnerabilityValues.push({
							value: vulnerability.vulnerability_id.toString(),
							label: vulnerability.vulnerability_name
						});
					}
				});
			}

			setVulnerabilityOptions(actualVulnerabilityOptions);
			setVulnerabilityValues(actualVulnerabilityValues);

			setTopReport(report.report_top_report);
			setDisclosure(report.report_disclosure);

			store.setReport(report);
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

	if(report == null){
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

	const onSubmit: SubmitHandler<ModifyReportInput> = async (data) => {
		const report: ReportUpdateRequest = {
			report: {
				report_id: report_id,
				report_weakness: data.weakness,
				report_disclosure: disclosure,
				report_top_report: topReport,
				report_comment: data.comment,
			},
			vulnerability: vulnerabilityValues
		}

		try {
			await apiUpdateReport(report);

			await new Promise((resolve) => {
				setTimeout(resolve, 3000);
			});

			callback();
		} catch (error: any) {
			if (error instanceof Error) {
				handleApiError(error);
			} else {
				toast.error(error.message);
				console.log("Error message:", error.message);
			}
		}
	};

	return (
		<>
			<FormProvider {...methods}>
				<form autoComplete={"new-password"} onSubmit={handleSubmit(onSubmit)}>
					<section className="d-flex justify-content-center align-items-start py-5 px-3 px-md-0">
						<div className="d-flex flex-column w-100 align-items-center">
							<div className="shadow-lg rounded p-4 p-sm-5 bg-white form" style={{width: "900px"}}>
								<h5 className="fw-bold text-muted">Report - {report?.report_title}</h5>
								<p className="text-muted">Modify a report</p>
								<div className={"row"}>
									<div className={"col-md-6"}>
										<CheckboxInput
											label={"Disclosure"}
											name={"disclosure"}
											checked={report?.report_disclosure}
											setValue={setDisclosure} />
									</div>
									<div className={"col-md-6"}>
										<CheckboxInput
											label={"Top report"}
											name={"topReport"}
											checked={report?.report_top_report}
											setValue={setTopReport} />
									</div>
								</div>
								<TextareaInput label={"Weakness"} name={"weakness"} value={report?.report_weakness} />
								<TextareaInput label={"Comment"} name={"comment"} value={report?.report_comment}  />
								<ReactSelectInput
									label={"Vulnerabilities"}
									name={"vulnerabilities"}
									options={vulnerabilityOptions}
									values={vulnerabilityValues}
									setValues={setVulnerabilityValues} />
								<button type="submit" className="btn btn-primary d-block w-100 my-4">Save</button>
							</div>
						</div>
					</section>
				</form>
			</FormProvider>

			<Script
				type={"text/javascript"}
				src={"../../assets/js/theme.bundle.js"}
				strategy="lazyOnload"></Script>
			<Script
				type={"text/javascript"}
				src={"../../assets/js/vendor.bundle.js"}
				strategy="lazyOnload"></Script>
		</>
	)
}

export default ModifyReport;