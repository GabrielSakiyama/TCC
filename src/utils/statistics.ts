import type { LinearRegression, RegressionCoefficients } from "@/types/statistics";

/** Converts the text field into finite numeric values. */
export function parseNumericValues(text: string): number[] {
    return text
        .split(/[,;\s]+/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map(Number)
        .filter(Number.isFinite);
}

/** Calculates the ordinary least-squares line for x = 1, 2, 3, ... */
export function calculateLinearRegression(
    values: number[],
): RegressionCoefficients | null {
    if (values.length < 2) return null;

    const points = values.map((y, index) => ({ x: index + 1, y }));
    const meanX = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

    const numerator = points.reduce(
        (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
        0,
    );
    const denominator = points.reduce(
        (sum, point) => sum + (point.x - meanX) ** 2,
        0,
    );

    const slope = denominator ? numerator / denominator : 0;
    return { slope, intercept: meanY - slope * meanX };
}

/** Calculates R² for the supplied coefficients and observed values. */
export function calculateRSquared(
    values: number[],
    { slope, intercept }: RegressionCoefficients,
): number {
    if (values.length === 0) return 1;

    const meanY = values.reduce((sum, value) => sum + value, 0) / values.length;
    const totalVariation = values.reduce(
        (sum, value) => sum + (value - meanY) ** 2,
        0,
    );
    const residualVariation = values.reduce(
        (sum, value, index) =>
            sum + (value - (slope * (index + 1) + intercept)) ** 2,
        0,
    );

    return totalVariation ? 1 - residualVariation / totalVariation : 1;
}

export function applyRegressionCoefficients(
    values: number[],
    calculated: RegressionCoefficients | null,
    editedSlope: string | null,
    editedIntercept: string | null,
): LinearRegression | null {
    if (!calculated) return null;

    const slope = editedSlope === null ? calculated.slope : Number(editedSlope || 0);
    const intercept = editedIntercept === null
        ? calculated.intercept
        : Number(editedIntercept || 0);

    return {
        slope,
        intercept,
        rSquared: calculateRSquared(values, { slope, intercept }),
    };
}

export function formatRegressionEquation(
    { slope, intercept }: RegressionCoefficients,
): string {
    return `ŷ = ${slope.toFixed(2)}x ${intercept < 0 ? "−" : "+"} ${Math.abs(intercept).toFixed(2)}`;
}
