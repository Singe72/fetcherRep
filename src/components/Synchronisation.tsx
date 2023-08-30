"use client";

import {apiIsSynchronising, apiSyncReports} from '@/lib/api-requests';
import {useEffect, useState} from "react";

const Synchronisation = () => {
	const [isSynchronising, setSynchronising] = useState(true);

	async function handleSync(){
		setSynchronising(true);
		apiSyncReports();
	}

	const detectIsSynchronising = async () => {
		const async = await apiIsSynchronising()
		setSynchronising(async.is_synchronising);
	}
	useEffect(() => {
		detectIsSynchronising();
		window.addEventListener("focus", detectIsSynchronising);
		return () => {
			window.removeEventListener("focus", detectIsSynchronising);
		};
	}, []);

	return <button className={"btn btn-primary btn-sm"} onClick={() => handleSync()} disabled={isSynchronising}>
		{isSynchronising ?
			<>Synchronisation en cours...</>
			:
			<>Synchroniser</>
		}
	</button>
}

export default Synchronisation;