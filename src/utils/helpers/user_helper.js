const fs = require('fs');
const { Parser } = require('json2csv');
const { serviceResponse } = require('./api_response');

exports.dumpJSONToCSV = (req, res, config = {
    data: [],
    fileName: 'Default CSV',
    columnNames: [],
}) => {
    try {
        const filename = config.fileName;

        const json2csvParser = new Parser({ fields: config.columnNames });
        const csv = json2csvParser.parse(config.data);

        fs.writeFileSync(filename, csv);

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        res.setHeader('Content-Type', 'text/csv');

        const fileStream = fs.createReadStream(filename);

        fileStream.pipe(res);

        fileStream.on('end', () => {
            fs.unlinkSync(filename);
        });
    } catch (error) {
        return res.status(200).send(new serviceResponse({ status: 500, errors: [{ message: `${error.message}` }] }));
    }
};


