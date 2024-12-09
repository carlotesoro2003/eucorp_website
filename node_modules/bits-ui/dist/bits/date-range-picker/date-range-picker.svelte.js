import { createContext } from "../../internal/create-context.js";
class DateRangePickerRootState {
    props;
    constructor(props) {
        this.props = props;
    }
}
export const [setDateRangePickerRootContext, getDateRangePickerRootContext] = createContext("DateRangePicker.Root");
export function useDateRangePickerRoot(props) {
    return setDateRangePickerRootContext(new DateRangePickerRootState(props));
}
