import {app} from "../../app";
import request from 'supertest';

it('responds with unauthorized when searching without being logged in', async () => {
    await request(app)
        .get("/api/book-info/search?term=flowers for algernon&pageIndex=1&pageItems=40")
        .expect(401)
});

it('responds search results', async () => {
    const result = await request(app)
        .get("/api/book-info/search?term=flowers for algernon&pageIndex=1&pageItems=40")
        .set("Cookie", global.signin())
        .expect(200)

    expect(result.body).toHaveProperty("results");
    expect(result.body).toHaveProperty("totalItems")
    expect(result.body).toHaveProperty("pageInfo")
});

it('responds with unauthorized when retrieving volume without being logged in', async () => {
    await request(app)
        .get("/api/book-info/volume?id=abcd")
        .expect(401)
});

it('responds volume results', async () => {
    const id = "_cI_AQAAQBAJ";
    const result = await request(app)
        .get("/api/book-info/volume?id=" + id)
        .set("Cookie", global.signin())
        .expect(200)

    expect(result.body).toHaveProperty("id");
    expect(result.body.id).toEqual(id);
    expect(result.body).toHaveProperty("title");
});