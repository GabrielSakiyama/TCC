export type LinearRegression = {
    slope: number;
    intercept: number;
    rSquared: number;
};

export type RegressionCoefficients = Pick<
    LinearRegression,
    "slope" | "intercept"
>;
