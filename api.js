const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

const URI = 'https://api.thecatapi.com/v1/images/search';

let NUMBER_OF_PHOTOS = 6;
let photos = [];


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/lirkis/renewPhotos', async (req, res) => {
    try {
        console.log('New photos were requested');
        await requestPhotos(NUMBER_OF_PHOTOS);
        res.json({ message: 'SUCCESS' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/lirkis/getphoto', async (req, res) => {
    try {
        const id = parseInt(req.query.id) || NUMBER_OF_PHOTOS;
        if (id > NUMBER_OF_PHOTOS) {
            NUMBER_OF_PHOTOS = id;
            console.log(`Number of photos requested was increased to: ${id}`);
            await requestPhotos(NUMBER_OF_PHOTOS);
        }
        console.log(`Requested photo with id: ${id}`);
        console.log(`RESULT: ${photos[id-1]}`);
        res.json({ url: photos[id-1].url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const requestPhotos = async (num) => {
    photos = [];
    for (let i = 0; i < num; i++) {
        const response = await sendRequest();
        photos.push(response);
    }
    console.log(`PHOTOS: Requesting new photos: ${num}`);
};

const sendRequest = async () => {
    try {
        const response = await axios.get(URI);
        const photo = response.data[0];
        return photo;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to get photo from API');
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
