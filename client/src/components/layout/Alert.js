import React from "react";
import { useSelector } from "react-redux";

export default function Alert() {
    // state.alert comes from the index.js rootReducer. "alert" is in the function
    const alerts = useSelector((state) => state.alert);

    return(
        alerts !== null &&
        alerts.length > 0 &&
            // when you map in JSX, it returns a list and you have to use a key
            // in the div
        alerts.map((alert) => (
            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                {alert.msg}
            </div>
        ))
    );
}
