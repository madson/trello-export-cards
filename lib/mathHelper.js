
const round2decimals = (num) => {
    return (Math.round((num + 0.01) * 100) / 100)
}

const pert = (optimistic, medium, pessimistic) => {
    // PERT technique formula reference:
    // https://www.techrepublic.com/blog/it-consultant/use-pert-technique-for-more-accurate-estimates/
    // (O + 4M + P)/6
    return (optimistic + (4 * medium) + pessimistic) / 6
}

module.exports = {
    round2decimals: round2decimals,
    pert: pert
}
