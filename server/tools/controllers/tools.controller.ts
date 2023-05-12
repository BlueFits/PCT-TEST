import express, { Request, Response } from "express";
import PuppeteerBrowser from "../../utils/puppeteerBrowser";
// import code from "./code";
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { IActivity, IActivityByID, IModifiedActivity, IScan, ITargetApi_getLive, experience_targetApi } from "../../../types/common.types";
//Regular import
const FormData = require('form-data');

class ToolsController {

    async getLive(req: Request, res: Response) {
        try {
            const token = (req.query.token as string);

            const response = await fetch(`https://mc.adobe.io/bmofinancialgroup/target/activities?workspace=12082912&name=tavc`, {
                method: "GET",
                headers: {
                    'Accept': 'application/vnd.adobe.target.v3+json',
                    'Authorization': `Bearer ${token}`,
                    'X-Api-Key': "b96f31f75ff243ea90c70af403b98019",
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                res.status(404).send({ error: errData });
            } else {
                const resData: ITargetApi_getLive = await response.json();
                const responseActivities: Array<IActivity> = resData.activities;
                let result = [];

                for (let i = 0; i < responseActivities.length; i++) {
                    const modifiedActivity: IModifiedActivity = {
                        ...responseActivities[i],
                        affectedURL: "",
                        experiences: [],
                    };
                    const type = responseActivities[i].type;
                    const activityID = responseActivities[i].id;
                    const getByIdRes_raw = await fetch(`https://mc.adobe.io/bmofinancialgroup/target/activities/${type}/${activityID}`, {
                        method: "GET",
                        headers: {
                            'Accept': 'application/vnd.adobe.target.v3+json',
                            'Authorization': `Bearer ${token}`,
                            'X-Api-Key': "b96f31f75ff243ea90c70af403b98019",
                        }
                    });
                    const getByIdRes: IActivityByID = await getByIdRes_raw.json();
                    const extractedCode = getByIdRes.options.map((option) => {
                        return {
                            optionLocalId: option.optionLocalId,
                            code: option.offerTemplates.length > 0 ? option.offerTemplates[0].templateParameters[0].value : null,
                        };
                    });
                    const experienceWithCodeUsed = getByIdRes.experiences.map((experience) => {
                        /* If there is more than one code in the experience it will only pick that up */
                        return {
                            name: experience.name,
                            // codeUsed: experience.optionLocations[0].optionLocalId,
                            codeUsed: experience.optionLocations,
                        }
                    })
                    const returnValue = experienceWithCodeUsed.map((value) => {
                        const code = extractedCode.find(extract => {
                            for (let optionLocation of value.codeUsed) {
                                if ((optionLocation.optionLocalId === extract.optionLocalId) && (extract) && extract.code !== null) {
                                    return true;
                                }
                            }
                        })
                        return {
                            name: value.name,
                            code: (code && code.code) || null,
                        };
                    })
                    /* Logic to extract affected url */
                    let codeInstance = (returnValue.find((value) => { if (value.code) return value.code })).code;
                    let indexStart = (codeInstance.indexOf("@TAVC=")) + 6;
                    let urlTemp = [];
                    for (let i = indexStart; i < codeInstance.length; i++) {
                        if (codeInstance[i] === ";") break;
                        urlTemp.push(codeInstance[i]);
                    }
                    modifiedActivity.affectedURL = urlTemp.join("");
                    modifiedActivity.experiences = returnValue;
                    result = [...result, modifiedActivity]
                }

                /* Send a modified version of the acvitiy with the code and the URL */
                res.status(200).send({ data: result })
            }

        } catch (err) {
            console.error("!!!", err);
            res.status(400).send({ error: err })
        }
    }
    /* Figure out how to properly generate token */
    async refresh_token(req: Request, res: Response) {
        const client_id = "b96f31f75ff243ea90c70af403b98019";
        const client_secret = "p8e-PV5okhHVvZACh4_-WRcw8TSDTfdKPyCl";
        const jwt_token = "eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjE2ODE1NjQxNDksImlzcyI6IjEyMTUzNEI4NTI3ODMwRjMwQTQ5MEQ0NEBBZG9iZU9yZyIsInN1YiI6IjZFRTYyQTc0NjQwOEE4RjUwQTQ5NUUwNEB0ZWNoYWNjdC5hZG9iZS5jb20iLCJhdWQiOiJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vYy9iOTZmMzFmNzVmZjI0M2VhOTBjNzBhZjQwM2I5ODAxOSIsImh0dHBzOi8vaW1zLW5hMS5hZG9iZWxvZ2luLmNvbS9zL2VudF9zdGF0dXNfYXBpIjp0cnVlLCJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vcy9lbnRfbWFya2V0aW5nX3NkayI6dHJ1ZX0.g3sp4b9oeZgtrHw8_2EklK27tKwGP2pZAPy9AeHVo3iTUKdDEvjefRios2IGIZ9Xtc9Yfbb66wXRTjT9IY-uWiUlCNN70ZpHFQ5Ea1GLtdPrxRvbcLD2O1ruPw42neAKZlSSTHYUO4K5maYKLEuMTti97rFqaH1ZRUQgqYF1bhJhMURokYopqLtmb0ewoFEnHpCW5XYTWbolxJgMr7-qXcctpIX2dS8tSH8It7L0aJ3dPAjW6TvAjiDLIFO5TmyHpr3YQT0UFVw16mDkasquoPbk_tP7f_o0w4xG7Rgq273YFNHM-by6GlAQJ916erKZ5ZxVhoJCEr5y6FIl-UD_PQ";

        const response = await fetch(
            `https://ims-na1.adobelogin.com/ims/exchange/jwt/?client_id=${client_id}&client_secret=${client_secret}&jwt_token=${jwt_token}`, {
            method: "POST",
        });

        if (!response.ok) {
            const errData = await response.json();
            res.status(404).send({ error: errData });
        } else {
            const resData = await response.json();
            res.status(200).send({ data: resData })
        }
    }

    async scan(req: Request, res: Response) {
        try {
            const affected_url = req.body.affected_url;
            const code = req.body.code;
            //Check if acitvity is ok
            const instance = await PuppeteerBrowser.build();
            const $ = cheerio.load(code);
            const scriptTxt = $($("script").get(0)).html();
            const data: IScan = await instance.checkPage(affected_url, scriptTxt);
            res.status(200).send({ data });
        } catch (err) {
            console.error(err)
            res.status(400).send({ error: err });
        }
    }
}

export default new ToolsController();