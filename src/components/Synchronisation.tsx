"use client";

import { apiSyncReports } from '@/lib/api-requests';

const Synchronisation = () => {
	async function handleSync(){
		apiSyncReports();
	}

	return <button className={"btn btn-primary btn-sm"} onClick={() => handleSync()}>Synchroniser</button>
}

export default Synchronisation;