const admin = require('firebase-admin');
const functions = require('firebase-functions');
const common = require('./common');
const constants = require('./constants');

const db = admin.firestore();

const operations = admin.firestore.FieldValue;

exports.addItem = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.item) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide an item');
        }

        if (!data.groupId) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a group id. Contact Matt');
        }

        return db.collection('groups').doc(data.groupId).get().then(doc => {
            return doc.ref.update({
                wishlist: {
                    ...doc.data().wishlist,
                    [context.auth.uid]: [...doc.data().wishlist[context.auth.uid], {
                        item: data.item,
                        url: data.url || null
                    }]
                }
            })
        })
    });


exports.removeItems = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.items || data.items.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Must remove at least one item');
        }

        if (!data.groupId) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a group id. Contact Matt');
        }

        return db.collection('groups').doc(data.groupId).get().then(doc => {
            return doc.ref.update({
                wishlist: {
                    ...doc.data().wishlist,
                    [context.auth.uid]: doc.data().wishlist[context.auth.uid].filter(x => !data.items.includes(x.item))
                }
            })
        })
    });

exports.editWishlistItem = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);

        if (!data.item) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide an item');
        }

        if (!data.groupId) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a group id. Contact Matt');
        }

        if (!common.isNumber(data.index)) {
            throw new functions.https.HttpsError('invalid-argument', 'Must provide a valid wishlist index. Contact Matt');
        }

        return db.collection('groups').doc(data.groupId).get().then(doc => {
            if (data.index  > doc.data().wishlist[context.auth.uid].length) {
                throw new functions.https.HttpsError('invalid-argument', 'Wishlist index out of range Contact Matt');
            }
            return doc.ref.update({
                wishlist: {
                    ...doc.data().wishlist,
                    [context.auth.uid]: doc.data().wishlist[context.auth.uid].map((x, index) => {
                        return index === data.index ? {
                            item: data.item,
                            url: data.url || null
                        } : x
                    })
                }
            })
        })
    });