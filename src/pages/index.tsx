import { useState, useEffect } from "react";
import ListDisplay from './_components/List/List';
import api from "../services/modules/activities/api";
import { IActivity, IModifiedActivity, ITargetApi_getLive, ITargetApi_getLive_client } from "../../types/common.types";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from "@mui/material";

export default function Home() {
	const [activities, setActivities] = useState<Array<IModifiedActivity> | []>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAct = async () => {
			const dummyData: Array<IModifiedActivity> = [{
				affectedURL: "https://www.bmo.com/en-ca/main/personal/",
				experiences: [{
					code: "<script>console.log('a')</script>",
					name: "experience A",
				}],
				id: 12,
				modifiedAt: "asd",
				name: "Test Story",
				priority: 1,
				state: "1",
				thirdPartyId: "123",
				type: "xt",
				workspace: "asd",
			}];

			setActivities(dummyData);
			setIsLoading(false);
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
