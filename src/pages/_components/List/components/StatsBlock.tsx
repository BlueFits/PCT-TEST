import { useEffect, useState } from 'react';
import { Typography, Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../../../../services/modules/activities/api';
import { IScan } from '../../../../../types/common.types';
import { resultStat } from '../List';

interface IStatsBlock {
    name: string;
    affected_url: string;
    code: string | -1;
    setOverall: (stats: resultStat, index) => void;
    index: number
}

const StatsBlock: React.FC<IStatsBlock> = ({ name, affected_url, code, setOverall, index }) => {

    const [results, setResults] = useState<IScan>();
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const scan = async () => {
            console.log("!!!", affected_url, code);
            setIsLoading(true);
            const resResult: { data: IScan } = await api.scanActivity({
                affected_url,
                code: (code! as string),
            });
            console.log("!!!", resResult);
            if (resResult && resResult.data) setResults(resResult.data);
            setIsLoading(false);
            if (resResult.data.errors.length > 0 || !resResult.data.adobe.VERSION) {
                setOverall(resultStat.NOT_OK, index + 1);
            } else {
                setOverall(resultStat.OK, index + 1);
            }
        };

        if (code && (code !== -1)) {
            scan();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className='flex items-center w-full pt-5 justify-start'>
            <div className='h-full flex items-start justify-center'>
                <Typography variant='h6'>
                    {name}
                </Typography>
            </div>
            {code === -1 && (
                <div className='ml-5'>
                    <Alert severity="warning">{name} does not have valid code.</Alert>
                </div>
            )}
            <ul className='px-5 flex items-center justify-center'>
                {isLoading ? <CircularProgress size={24} /> :
                    (results && results.errors && results.errors.length > 0) ? results.errors.map((error, index) => {
                        return (
                            <li key={"KeyForStatBlockLi:" + index}>
                                <Alert severity="error">{error}</Alert>
                            </li>
                        );
                    }) : <Alert severity="success">Experience has no issues</Alert>
                }
            </ul>
        </div >
    );
}

export default StatsBlock;