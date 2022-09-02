const express = require("express")
const app = express()
const ytdl = require('ytdl-core');
const cors = require("cors")
const ytsr = require("ytsr")

app.use(cors())

app.get("/", (req, res) => {
    res.send("Ping");
})

app.get("/:id", async (req, res) => {
    const video = await ytdl.getInfo(req.params.id);
    res.send(video);
})

app.get("/search/:term", async (req, res) => {
    const video = await ytsr(req.params.term);
    res.send(video);
})

app.listen(3000);