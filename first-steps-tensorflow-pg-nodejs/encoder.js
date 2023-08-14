require('dotenv').config();
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const pgp = require('pg-promise')({
    capSQL: true // capitalize all generated SQL
});
const moviePlots = require("./movie-plots.json");//.slice(0, 500);

const connectionString = new URL(process.env.PG_CONNECTION_STRING);
const config = {
    connectionString: connectionString.href,
    ssl: {
        rejectUnauthorized: false
    },
};

const db = pgp(config);

const storeInPG = (moviePlots) => {
    // set of columns
    const columns = new pgp.helpers.ColumnSet(['title', 'director', 'plot', 'year', 'wiki', 'cast', 'genre', 'embedding'], {table: 'movie_plots'});

    const values = [];
    for (let i = 0; i < moviePlots.length; i++) {
        values.push({
            title: moviePlots[i]['Title'],
            director: moviePlots[i]['Director'],
            plot: moviePlots[i]['Plot'],
            year: moviePlots[i]['Release Year'],
            cast: moviePlots[i]['Cast'],
            genre: moviePlots[i]['Genre'],
            wiki: moviePlots[i]['Wiki Page'],
            embedding: `[${moviePlots[i]['embedding']}]`
        })
    }

    // generating a multi-row insert query:
    const query = pgp.helpers.insert(values, columns);

    // executing the query:
    db.none(query).then(res => console.log(res));
}

use.load().then(async model => {
    const batchSize = 100;
    for (let start = 0; start < moviePlots.length; start += batchSize) {
        const end = Math.min(start + batchSize, moviePlots.length);
        console.log(`Processing starting from ${start} with the step ${batchSize} of total amount ${moviePlots.length}.`);
        const plotDescriptions = moviePlots.slice(start, end).map(moviePlot => moviePlot.Plot);
        const embeddings = await model.embed(plotDescriptions);
        for (let i = start; i < end; i++) {
            moviePlots[i]['embedding'] = embeddings.arraySync()[i - start];
        }
    }

    storeInPG(moviePlots)
});

