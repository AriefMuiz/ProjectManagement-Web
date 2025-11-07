import { useCallback } from "react";
import debounce from "lodash.debounce";

const handleSliderChange = (setCurrentTime) =>
    useCallback(
        debounce((newTime) => {
            setCurrentTime(newTime);
        }, ), // Adjust the delay (in milliseconds) as needed
        [setCurrentTime]
    );

export const onSliderChange = (event, setCurrentTime) => {
    const newTime = Number(event.target.value);
    const debouncedHandler = handleSliderChange(setCurrentTime);
    debouncedHandler(newTime);
};