import { createContext } from "../../internal/create-context.js";
class DatePickerRootState {
    props;
    constructor(props) {
        this.props = props;
    }
}
export const [setDatePickerRootContext, getDatePickerRootContext] = createContext("DatePicker.Root");
export function useDatePickerRoot(props) {
    return setDatePickerRootContext(new DatePickerRootState(props));
}
