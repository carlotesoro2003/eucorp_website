    
/**
 * Calculate risk control rating based on likelihood and severity
 * @param {string} likelihoodSymbol - The likelihood symbol (A-E)
 * @param {number} severityValue - The severity value (1-5)
 * @returns {string} The risk control rating symbol
 */
interface LikelihoodMapping {
    [key: string]: number;
}

interface RatingMatrix {
    [index: number]: string[];
}

const ratingMatrix: RatingMatrix = [
    ["M", "H", "H", "VH", "VH"],
    ["L", "M", "H", "H", "VH"],
    ["L", "L", "M", "H", "H"],
    ["L", "L", "M", "M", "H"],
    ["L", "L", "L", "M", "M"],
];

const likelihoodMapping: LikelihoodMapping = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
};

export function calculateRiskControlRating(likelihoodSymbol: string, severityValue: number): string {
    // Get likelihood index from mapping
    const likelihoodIndex = likelihoodMapping[likelihoodSymbol];
    // Adjust severity value to 0-based index
    const severityIndex = severityValue - 1;

    // Validate inputs
    if (likelihoodIndex === undefined || severityIndex < 0 || severityIndex > 4) {
        throw new Error("Invalid likelihood symbol or severity value");
    }

    // Return rating from matrix
    return ratingMatrix[likelihoodIndex][severityIndex];
}
