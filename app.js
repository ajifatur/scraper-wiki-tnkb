const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://id.wikipedia.org/wiki/Tanda_Nomor_Kendaraan_Bermotor_Indonesia')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let data = [];
                $('.wikitable tbody tr').each(function(i, elem) {
                    if($(elem).find('td').length == 3) {
                        let splitWilayah = $(elem).find('td:nth-child(2)').html().split('<br>');
                        let residence = (splitWilayah[0].search(':') >= 0) ? $(splitWilayah[0]).text().trim().replace(':', '') : '';
                        for(var j=0; j<splitWilayah.length; j++) {
                            if(splitWilayah[j].search(':') < 0) {
                                data.push({
                                    huruf: $(elem).find('td:nth-child(1) a').text(),
                                    wilayah: $(splitWilayah[j]).text().trim(),
                                    residen: residence
                                });
                            }
                        }
                    }
                });
                data = data.filter(n => n !== undefined);
                res.json(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});