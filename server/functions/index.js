const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://japanese-flash-card-a8a7a-default-rtdb.firebaseio.com"
});
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));

app.post('/flashcards/create', (req, res) => {
    (async () => {
        try {
            await db.collection('flashcards').doc("/" + req.body.kana + "/")
                .create({ chinese: req.body.chinese, kanji: req.body.kanji });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
//Fisher-Yates Shuffle
function shuffleAndSlice(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, 21)
}
app.get('/flashcards', async (req, res) => {
    (async () => {
        try {
            let query = db.collection('flashcards');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        kana: doc.id,
                        chinese: doc.data().chinese,
                        kanji: doc.data().kanji
                    };
                    response.push(selectedItem);
                }
                return null
            });
            return res.status(200).send(shuffleAndSlice(response));
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});
exports.app = functions.https.onRequest(app);