// Reviewed product education. No issuer observations or generated answers live here.
export const HELP = {
    confidence: {
        title: "Evidence Confidence", question: "How complete and usable is the evidence behind this research?",
        meaning: "Evidence Confidence describes the supporting simulated evidence. It is separate from whether the Research Picture is Strong, Mixed or Weak.",
        tells: "Whether research has recent, traceable and usable supporting evidence.",
        limitation: "It is not a guarantee, investment recommendation, profit probability or independent real-world verification.",
        checks: ["Finding provenance", "Financial-period coverage", "Recency", "Eligible price or IPO evidence coverage", "Source readability and reproducibility"],
    },
    fresh: {
        title: "Fresh Issue", question: "Which part of the offer funds the company?",
        meaning: "The company issues new shares. Gross fresh proceeds are the selected offer price multiplied by the new shares; issue expenses reduce the amount available to the company.",
        tells: "Net fresh proceeds can be allocated to the documented funding purposes. New shares increase the post-offer share count.",
        limitation: "Planned funding does not automatically increase historical earnings or guarantee future growth.",
    },
    ofs: {
        title: "Offer for Sale (OFS)", question: "Who receives the money when existing shares are sold?",
        meaning: "Existing holders transfer shares to new holders. These sale proceeds go to the selling holders, not to the company’s bank account.",
        tells: "OFS changes who owns shares. It does not create new shares or company financing cash.",
        limitation: "An owner sale alone does not establish a motive or make the offer good or bad.",
    },
    subscription: {
        title: "Investor categories and subscription", question: "What does a subscription multiple mean?",
        meaning: "It compares shares requested with shares reserved for the same investor category at one simulated observation time. QIB means Large Professional Investors; NII means Large Individual Investors. Regular Individual Investors form the third category.",
        tells: "Subscribed shares ÷ reserved shares describes observed demand. Above one means requests exceed that category’s reserved shares.",
        limitation: "Demand is not a listing-return prediction. Missing observations are unavailable, never zero.",
    },
    valuation: {
        title: "Price vs Value", question: "How does the offer price compare with similar businesses’ earnings?",
        meaning: "This compares price-to-earnings (P/E) with eligible listed peers in the same sector. It uses compatible four-quarter earnings and at least two peers.",
        tells: "IPO earnings per share use historical income divided by post-offer shares. The price is the published final issue price or a labeled upper-band illustration.",
        limitation: "This is relative valuation, not intrinsic value. The small peer set and different business risks limit the comparison.",
    },
} satisfies Record<string, { title: string; question: string; meaning: string; tells: string; limitation: string; checks?: readonly string[] }>;
export type HelpTopic = keyof typeof HELP;
