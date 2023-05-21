import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StatsBlock from './components/StatsBlock';

interface IListDisplay {
    type: string;
    activityName: string,
    affectedURL: string;
    experiences: Array<{
        name: string;
        code: string;
    }>;
};

export enum resultStat {
    OK = "ok",
    NOT_OK = "not ok",
    STANDBY = "standby",
}

const ListDisplay: React.FC<IListDisplay> = ({
    type,
    activityName,
    affectedURL,
    experiences,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<resultStat>(resultStat.OK);
    const [showMoreInfo, setShowMoreInfo] = useState<boolean>(false);

    const setOverallHandler = (param: resultStat, index: number) => {
        if (index === experiences.length) {
            setIsLoading(false);
            // console.log("last index", result)
            // if (result !== resultStat.NOT_OK) {
            //     setResult(param);
            // }
        }
        if (param === resultStat.NOT_OK) setResult(param);
    };

    return (
        <li>
            <div className={`flex items-center justify-between py-3 px-2 ${showMoreInfo ? "" : "border-b-2"}`}>
                {/* Type */}
                <div className='w-20 border-2 flex justify-center'>
                    <Typography>
                        {type}
                    </Typography>
                </div>
                {/* Name */}
                <div className='w-[450px]'>
                    <Typography>
                        {activityName}
                    </Typography>
                </div>
                {/* Status */}
                <div className='w-20 justify-center flex'>
                    {!isLoading ?
                        <Typography>
                            {result}
                        </Typography> :
                        <CircularProgress size={24} />
                    }
                </div>
                {/* buttons */}
                <div className='w-[200px]'>
                    <Stack sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} direction="row" spacing={1}>
                        <IconButton
                            color="secondary"
                            onClick={() => setShowMoreInfo(!showMoreInfo)}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </Stack>
                </div>
            </div>
            <div className={`${!showMoreInfo ? "hidden" : ""} flex items-start border-b-2 py-3 px-2 flex-col`}>
                {experiences && experiences.map((exp, index) =>
                    <StatsBlock
                        key={index + "keyForStatsBlock"}
                        index={index}
                        setOverall={setOverallHandler}
                        name={exp.name}
                        affected_url={affectedURL}
                        code={exp.code || -1}
                    />
                )}
            </div>
        </li>
    );
};

export default ListDisplay;