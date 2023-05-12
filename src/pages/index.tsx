import { useState, useEffect } from "react";
import ListDisplay from './_components/List/List';
import api from "../services/modules/activities/api";
import { IActivity, IModifiedActivity, ITargetApi_getLive_client } from "../../types/common.types";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from "@mui/material";

export default function Home() {
	const [activities, setActivities] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAct = async () => {
			const activitiesResponse: ITargetApi_getLive_client = await api.getActivities();
			console.log("activities", activitiesResponse);
			setActivities(activitiesResponse.data);
			setIsLoading(false);
			// console.log("!!!", activitiesResponse);
		};
		fetchAct();
	}, []);

	return (
		<section>
			<ul>
				{isLoading && (
					<div className="border-2 flex justify-center items-center h-screen flex-col">
						<CircularProgress size={40} />
						<Typography marginTop={3} variant="h6">
							Fetching Live Activities
						</Typography>
					</div>
				)}
				{activities.length > 0 && activities.map((activity: IModifiedActivity, index) => {
					return (
						<ListDisplay
							key={`key:${index}`}
							activityName={activity.name}
							type={activity.type}
							affectedURL={activity.affectedURL}
							experiences={activity.experiences}
						/>
					);
				})}
			</ul>
		</section>
	)
}
