import request from 'supertest';
import {app} from "../../app";
import {ShelfType} from "../../models/shelf";

it('responds unauthorized when retrieving shelfs while not logged in', async () => {
    await request(app)
        .get('/api/shelf')
        .expect(401);
})

it("responds with the user's shelves", async () => {
    const session = await global.signin();

    const result = await request(app)
        .get('/api/shelf')
        .set("Cookie", session)
        .expect(200);

    expect(result.body).toHaveProperty("userId");
    expect(result.body).toHaveProperty("books");
})

it('responds with updated shelves when moving a book', async () => {

    const session = await signin();
    await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.READ,
        })
        .expect(200);

    let result = await request(app)
        .get('/api/shelf')
        .set("Cookie", session)
        .expect(200);

    expect(result.body).toHaveProperty("books")
    expect(result.body.books).toHaveProperty("1234");
    expect(result.body.books["1234"]).toEqual(ShelfType.READ);

    await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.READING
        }).expect(200);

    result = await request(app)
        .get('/api/shelf')
        .set("Cookie", session)
        .expect(200);

    expect(result.body.books["1234"]).toEqual(ShelfType.READING);

    await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.NONE
        }).expect(200);

    result = await request(app)
        .get('/api/shelf')
        .set("Cookie", session)
        .expect(200);
    
    expect(result.body.books["1234"]).toBeUndefined();
});

it('responds bad request when provided data is invalid', async () => {
    const items = [
        {bookId: null, shelfType: ShelfType.READ},
        {bookId: "2345", shelfType: 'test'},
        {bookId: "234", shelfType: null},
    ]

    const session = await global.signin();

    for (let item in items) {
        await request(app)
            .post('/api/shelf')
            .set("Cookie", session)
            .send(item)
            .expect(400)
    }
})