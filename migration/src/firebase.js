import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

class FirestoreExporter {
  constructor() {
    this.app = initializeApp(firebaseConfig, "migration");
    this.db = getFirestore(this.app);
    this.collections = [
      "users",
      "rooms",
      "messages",
      "resources",
      "studySessions",
      "quizAttempts",
    ];
    this.data = {};
  }

  async exportAllCollections(options = {}) {
    const { skipCollections = [], batchSize = 500 } = options;

    console.log("Starting Firestore export...");
    console.log(
      "Collections:",
      this.collections.filter((c) => !skipCollections.includes(c)),
    );

    for (const collectionName of this.collections) {
      if (skipCollections.includes(collectionName)) {
        console.log(`Skipping collection: ${collectionName}`);
        continue;
      }

      try {
        const data = await this.exportCollection(collectionName, batchSize);
        this.data[collectionName] = data;
        console.log(
          `Exported ${data.length} documents from '${collectionName}'`,
        );
      } catch (error) {
        console.error(`Error exporting '${collectionName}':`, error.message);
        this.data[collectionName] = [];
      }
    }

    return this.data;
  }

  async exportCollection(collectionName, batchSize = 500) {
    const documents = [];
    let lastDoc = null;
    let hasMore = true;

    while (hasMore) {
      let q;

      if (lastDoc) {
        q = query(collection(this.db, collectionName), limit(batchSize));
      } else {
        q = query(collection(this.db, collectionName), limit(batchSize));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        hasMore = false;
        break;
      }

      snapshot.forEach((doc) => {
        documents.push({
          _id: doc.id,
          _data: doc.data(),
          _createdAt: doc.createTime?.toDate(),
          _updatedAt: doc.updateTime?.toDate(),
        });
      });

      lastDoc = snapshot.docs[snapshot.docs.length - 1];

      if (snapshot.docs.length < batchSize) {
        hasMore = false;
      }

      console.log(`  Fetched ${documents.length} documents so far...`);
    }

    return documents;
  }

  async exportCollectionWithFilters(
    collectionName,
    filters = {},
    orderByField = null,
    orderDirection = "asc",
  ) {
    const documents = [];
    const constraints = [];

    for (const [field, value] of Object.entries(filters)) {
      constraints.push(where(field, "==", value));
    }

    if (orderByField) {
      constraints.push(orderBy(orderByField, orderDirection));
    }

    const q = query(collection(this.db, collectionName), ...constraints);
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      documents.push({
        _id: doc.id,
        _data: doc.data(),
        _createdAt: doc.createTime?.toDate(),
        _updatedAt: doc.updateTime?.toDate(),
      });
    });

    return documents;
  }

  async saveToJson(filename = "firestore-export.json") {
    const fs = await import("fs/promises");
    const path = await import("path");

    const exportPath = path.join(process.cwd(), filename);
    const jsonContent = JSON.stringify(this.data, null, 2);

    await fs.writeFile(exportPath, jsonContent);
    console.log(`Data saved to ${exportPath}`);

    return exportPath;
  }

  getCollectionStats() {
    const stats = {};
    for (const [name, docs] of Object.entries(this.data)) {
      stats[name] = {
        count: docs.length,
        sample: docs[0] || null,
      };
    }
    return stats;
  }
}

export const exporter = new FirestoreExporter();
export default exporter;
