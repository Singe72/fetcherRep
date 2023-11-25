"use client";

import React, {useEffect, useState} from "react";
import {apiGetStatistics} from "@/lib/api-requests";
import {StatisticsResponse} from "@/lib/types";

const Statistics = () => {
	const [statistics, setStatistics] = useState(null as StatisticsResponse|null);

	const fetchStatistics = async () => {
		const statistics = await apiGetStatistics();
		setStatistics(statistics);
	};

	useEffect(() => {
		fetchStatistics();
		window.addEventListener("focus", fetchStatistics);
		return () => {
			window.removeEventListener("focus", fetchStatistics);
		};
	}, []);

	if(statistics == null){
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
		<div className={"d-flex flex-wrap justify-content-around align-items-center gap-5"}>
			<div className="card card-info mb-4">
				<div className="card-header justify-content-between align-items-center d-flex">
					<h4 className="card-title fw-bold m-0">Saved reports</h4>
				</div>
				<div className="card-body px-4 pb-2 pt-0">
					<h5>
						<span className={"badge bg-primary badge-pill"}>{statistics.statistics.nb_report}</span>
					</h5>
				</div>
			</div>

			<div className="card card-info mb-4">
				<div className="card-header justify-content-between align-items-center d-flex">
					<h4 className="card-title fw-bold m-0">New reports</h4>
				</div>
				<div className="card-body px-4 pb-2 pt-0">
					<h5>
						<span className={"badge bg-primary badge-pill"}>{statistics.statistics.nb_new_report}</span>
					</h5>
				</div>
			</div>

			<div className="card card-info mb-4">
				<div className="card-header justify-content-between align-items-center d-flex">
					<h4 className="card-title fw-bold m-0">Programs</h4>
				</div>
				<div className="card-body px-4 pb-2 pt-0">
					<h5>
						<span className={"badge bg-primary badge-pill"}>{statistics.statistics.nb_programs}</span>
					</h5>
				</div>
			</div>

			<div className="card card-info mb-4">
				<div className="card-header justify-content-between align-items-center d-flex">
					<h4 className="card-title fw-bold m-0">Max Reward</h4>
				</div>
				<div className="card-body px-4 pb-2 pt-0">
					<h5>
						<span className={"badge bg-primary badge-pill"}>{statistics.statistics.max_reward}$</span>
					</h5>
				</div>
			</div>
		</div>
	)
}

export default Statistics