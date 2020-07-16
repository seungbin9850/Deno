import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

interface Dog {
    name: string;
    age: number;
}

let dogs: Array<Dog> = [
    {
        name: "Roger",
        age: 8,
    },
    {
        name: "Syd",
        age: 7,
    },
];

export const getDogs = ({ response }: { response: any }) => {
    response.body = dogs;
}

export const getDog = ({ params, response }: { params: { name: string }; response: any }) => {
    const dog = dogs.filter((dog) => dog.name === params.name);
    if (dog.length) {
        response.status = 200;
        response.body = dog[0];
        return;
    }
    response.status = 400;
    response.body = {
        msg: `Cannot find dog ${params.name}`,
    }
}

export const addDog = async ({ request, response }:{ request: any, response: any }) => {
    const dog: Dog = await request.body().value;
    dogs.push(dog);

    response.status = 200;
    response.body = { msg: "OK" };
}

export const updateDog = async ({ params, request, response }: { params: { name: string }; request: any; response: any }) => {
    const temp = dogs.filter((existingDog) => existingDog.name === params.name);
    const { age }: { age: number } = await request.body().value;

    if (temp.length) {
        temp[0].age = age;
        response.status = 200;
        response.body = { msg: "OK" }
        return;
    }

    response.status = 400;
    response.body = { msg: `Cannot find dog ${params.name}` }
}

export const removeDog = ({ params, response }: { params: { name: string }; response: any }) => {
    const lengthBefore = dogs.length;
    dogs = dogs.filter((dog) => dog.name !== params.name);

    if (dogs.length === lengthBefore) {
        response.status = 400;
        response.body = {
            msg: `Cannot find dog ${params.name}`
        }
        return;
    }

    response.status = 200;
    response.body = {
        msg: "OK"
    };
}
const router = new Router();

router
    .get('/dogs', getDogs)
    .get('/dogs/:name', getDog)
    .post('/dogs', addDog)
    .put('/dogs/:name', updateDog)
    .delete('/dogs/:name', removeDog);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
