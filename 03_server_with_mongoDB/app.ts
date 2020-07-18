import { MongoClient } from "https://deno.land/x/mongo@v0.9.1/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "./config.ts";

const client = new MongoClient();
client.connectWithUri(DB);

interface UserSchema {
    username: string;
    password: string;
}

const db = client.database("test");
const User = db.collection<UserSchema>("users");

const insertUser = async({ request, response }: { request: any; response: any }) => {
    const { username, password } = await request.body().value;
    try {
        await User.insertOne ({
            username,
            password
        });
        response.status = 200;
        response.body = {
            message: "success"
        }
    } catch (e) {
        response.status = 500;
        response.body = {
            message: e.message
        }
    }
}

const getAllUser = async({ response }: { response: any }) => {
    try {
        const users = await User.find();
        response.status = 200;
        response.body = {
            message: "success",
            users
        }
    } catch (e) {
        response.status = 500;
        response.body = {
            message: e.message
        }
    }
}

const getUser = async({ params, response }: { params: { _id: string }; response: any }) => {
    try {
        const user = await User.findOne({ _id: { $oid: params._id } });
        response.status = 200;
        response.body = {
            message: "success",
            user
        }
    } catch (e) {
        response.status = 404;
        response.body = {
            message: "Not Found"
        }
    }
}

const deleteOne = async({ params, response }: { params: { _id: string }; response: any }) => {
    try {
        await User.deleteOne({ _id: { $oid: params._id } });
        response.status = 200;
        response.body = {
            message: "success"
        }
    } catch (e) {
        response.status = 404;
        response.body = {
            message: "failed"
        }
    }
}

const updateOne = async({ params, request, response }: { params: { _id: string }; request: any; response: any }) =>  {
    const { password } = await request.body().value;
    try {
        await User.updateOne({ _id: { $oid: params._id }}, { $set: { password } })
        response.status = 200;
        response.body = {
            message: "success"
        }
    } catch (e) {
        response.status = 500;
        response.body = {
            message: "failed"
        }
    }
}

const router = new Router();

router
    .post('/user', insertUser)
    .get('/user', getAllUser)
    .get('/user/:_id', getUser)
    .delete('/user/:_id', deleteOne)
    .put('/user/:_id', updateOne)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("server is running on port 3000");
app.listen({ port: 3000 });