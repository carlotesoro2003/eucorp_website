import type { WithRefProps } from "../../internal/types.js";
type LabelRootStateProps = WithRefProps;
declare class LabelRootState {
    #private;
    constructor(props: LabelRootStateProps);
    props: {
        "data-label-root": string;
        onmousedown: (e: MouseEvent) => void;
    };
}
export declare function setLabelRootState(props: LabelRootStateProps): LabelRootState;
export {};
