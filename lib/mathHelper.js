
const round2decimals = (num) => {
    return (Math.round((num + 0.01) * 100) / 100)
}

const pert = (optimistic, pessimistic) => {
    return (optimistic + 2 * pessimistic) / 3
}

module.exports = {
    round2decimals: round2decimals,
    pert: pert
}
