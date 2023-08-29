"use client";

import {
	ModifyReportSchema,
	ModifyReportInput
} from "@/lib/validations/report.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {apiFetchReports, apiUpdateReport} from "@/lib/api-requests";
import {useReportStore} from "@/store";
import { handleApiError } from "@/lib/helpers";
import {toast, Toaster} from "react-hot-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {IReport, ReportUpdateRequest} from "@/lib/types";

import CheckboxInput from "@/components/CheckboxInput";
import TextareaInput from "@/components/TextareaInput";
import ReactSelectInput from "@/components/ReactSelectInput";

const ReportPage = ({params}: {params: {report_id: string}}) => {
	const store = useReportStore();
	const router = useRouter();
	const reports = store.reports;
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
			const reports = await apiFetchReports();

			const actualVulnerabilityOptions: {value: string, label: string}[] = [];
			reports.map((report) => {
				report.report_vulnerabilities.map((report_vulnerability) => {
					if(!actualVulnerabilityOptions.some(
						(value) => value.value == report_vulnerability.vulnerability.vulnerability_id.toString()
					)){
						actualVulnerabilityOptions.push({
							value: report_vulnerability.vulnerability.vulnerability_id.toString(),
							label: report_vulnerability.vulnerability.vulnerability_name
						});
					}
				})
			})
			setVulnerabilityOptions(actualVulnerabilityOptions);

			const report = reports.find((value) => params.report_id)!;

			const actualVulnerabilityValues: {value: string, label: string}[] = [];
			report?.report_vulnerabilities.map((report_vulnerability) => {
				actualVulnerabilityValues.push({
					value: report_vulnerability.vulnerability.vulnerability_id.toString(),
					label: report_vulnerability.vulnerability.vulnerability_name
				});
			})
			setVulnerabilityValues(actualVulnerabilityValues);

			setTopReport(report.report_top_report);
			setDisclosure(report.report_disclosure);

			store.setReportList(reports);
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

	const onSubmit: SubmitHandler<ModifyReportInput> = async (data) => {
		const report: ReportUpdateRequest = {
			report: {
				report_id: params.report_id,
				report_weakness: data.weakness,
				report_disclosure: disclosure,
				report_top_report: topReport,
				report_comment: data.comment,
			},
			vulnerability: vulnerabilityValues
		}

		try {
			await apiUpdateReport(report);

			toast.success("Report has been udpated successfully! You will be redirected in a few seconds...");

			await new Promise((resolve) => {
				setTimeout(resolve, 3000);
			});

			return router.push("/");
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
			<Toaster />
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

export default ReportPage;