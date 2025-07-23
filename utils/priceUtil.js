function parsePrice(priceText) {
    if (!priceText) return 0;
    // Remove ₹, commas, extra spaces
    const clean = priceText.replace(/[^\d.]/g, '').trim();
    return parseFloat(clean) || 0;
}

module.exports = { parsePrice };
