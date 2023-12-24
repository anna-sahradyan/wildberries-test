const axios = require('axios');
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
require("dotenv").config();

async function getStockInfo(art) {
    const url = `https://card.wb.ru/cards/v1/detail?appType=1&curr=rub&dest=-1257786&spp=27&nm=${art}&deliveryinfo?latitude=55.753737&longitude=37.6201`;

    try {
        const response = await axios.get(url);
        const data = response.data.data.products[0];

        if (!data) {
            console.error(`Error fetching data for art ${art}:Invalid response structure`);
            return null;
        }
        const sizes = {};
        data.sizes.forEach(size => {
            const origName = size.origName.trim();
            const stock = size.stocks.reduce((total, stockItem) => total + stockItem.qty, 0);
            sizes[origName] = stock;
        });

        return {art, stock: sizes};
    } catch (error) {
        console.error(`Error fetching data for art ${art}: ${error.message}`);
        return null;
    }
}


app.get("/", async (req, res) => {
    const artList = [146972802, 36328331, 146972802, 154611222, 190456385, 183271022, 182770058, 190627235, 67508839, 178142953, 183270278, 183269075, 183266945, 166416619, 173462958, 166417437];

    const results = [];

    for (const art of artList) {
        const stockInfo = await getStockInfo(art);
        if (stockInfo) {
            results.push(stockInfo);
        }
    }

    res.json(results);
})
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
})
