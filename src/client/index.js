import { Client, Storage, Databases } from "appwrite";

const client = new Client();

const storage = new Storage(client);

const databases = new Databases(client);

console.log(process.env.VUE_APP_WRITE_HOST)

client.setEndpoint(`${process.env.VUE_APP_WRITE_HOST}/v1`).setProject(process.env.VUE_APP_PROJECT_ID);

export { client, storage, databases }