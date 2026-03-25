import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import { getTimeStamp } from "../util/timeStamp"
import { authToken } from "../routes/daraja/route"
import logger from '../util/logger.js';
dotenv.config()

const router = express.Router()

router.post("/stk", authToken, async (req, res) => {
    try {
        const number = req.body.phoneNumber.replace(/^0/, '')
        const phoneNumber = `254${number}`
        const amount = req.body.amount
        const timestamp = getTimeStamp();

        const access_token = req.authData;
        if (!access_token) {
            return res.status(401).json({ error: "Access token missing" })
        }
        const domain = process.env.DOMAIN || req.callbackUrl

        const password = Buffer.from(`${process.env.BusinessShortCode}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64')
        const stkUrl = ''

        const body = {
            "BusinessShortCode": process.env.BusinessShortCode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phoneNumber,
            "PartyB": process.env.BusinessShortCode,
            "PhoneNumber": phoneNumber,
            "CallBackURL": `${domain}/callbackURL`,
            "AccountReference": "Urbanville Sports",
            "TransactionDesc": "Urbanville Sports Payment"
        };

        const response = await axios.post(stkUrl, body, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        })
        const stkResponse = response.data;



        const queryEndpoint = 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

        let resultCode, resultDesc;

        if (stkResponse.ResponseCode == '0') {

            const requestID = stkResponse.CheckoutRequestID;

            const queryPayload = {
                "BusinessShortCode": process.env.BusinessShortCode,
                "Password": password,
                "Timestamp": timestamp,
                "CheckoutRequestID": requestID
            };

            const timer = setInterval(async () => {
                try {
                    const status = await axios.post(queryEndpoint, queryPayload, {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    resultCode = status.data.ResultCode;
                    resultDesc = status.data.ResultDesc;



                    if (resultCode == '0') {
                        res.render('success', {
                            type: "Successful",
                            heading: "Payment Request Successful",
                            desc: "The payment request was processed successfully."
                        });
                        clearInterval(timer);

                    } else if (resultCode === '1032') {
                        res.render('failed', {
                            type: "cancelled",
                            heading: "Request cancelled by the User",
                            desc: "The user cancelled the request on their phone. Please try again and enter your pin to confirm payment"
                        });
                        clearInterval(timer);


                    } else if (resultCode === '1') {
                        res.render('failed', {
                            type: "failed",
                            heading: "Request failed due to insufficient balance",
                            desc: "Please deposit funds on your M-PESA or use Overdraft(Fuliza) to complete the transaction"
                        });
                        clearInterval(timer);

                    } else {
                        res.render('failed', {
                            type: "failed",
                            heading: "Payment request failed",
                            desc: `${resultDesc}. Please try again to complete the transaction`,
                        });
                        clearInterval(timer);

                    }

                } catch (error) {
                    logger.error('Error in STK Push query:', error.response ? error.response.data : error.message);



                }
            }, 15000);

        }

    } catch (error) {
        logger.error("STK Push Error:", error.response?.data || error.message);
        const errorData = error.response?.data;
        // logger.info(errorData)
        const errorMessage = errorData?.errorMessage || error.message;

        // logger.info(errorMessage);
        res.render('failed', {
            type: "failed",
            heading: "Error sending the push request",
            desc: errorMessage
        });
    }
})