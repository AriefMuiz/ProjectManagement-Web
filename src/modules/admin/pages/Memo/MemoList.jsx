import React, { useEffect, useState } from "react";
import MemoTable from "../../../../components/table/MemoTable.jsx";


function MemoList() {
    const [toastType, setToastType] = useState("success");

    const setToast = (message, type) => {
        setToastMessage(message);
        setToastType(type);
    };
    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <MemoTable setToast={setToast}/>
        </div>
    );
}

export default MemoList;