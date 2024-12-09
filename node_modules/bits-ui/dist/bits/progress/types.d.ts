import type { WithChild, Without } from "../../internal/types.js";
import type { BitsPrimitiveDivAttributes } from "../../shared/attributes.js";
export type ProgressRootPropsWithoutHTML = WithChild<{
    /**
     * The current value of the progress bar.
     * If `null`, the progress bar will be in an indeterminate state.
     */
    value?: number | null;
    /**
     * The maximum value of the progress bar. Used to calculate the percentage
     * of the progress bar along with the `value` prop.
     */
    max?: number;
}>;
export type ProgressRootProps = ProgressRootPropsWithoutHTML & Without<BitsPrimitiveDivAttributes, ProgressRootPropsWithoutHTML>;
