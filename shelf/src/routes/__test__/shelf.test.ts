import request from 'supertest';
import {app} from "../../app";
import {ShelfType} from "../../models/user";

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

    expect(result.body).toBeDefined();
})

it('responds with updated shelves when moving a book', async () => {

    const session = await signin();
    const result = await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.READ,
        })
        .expect(200);

    expect(result.body).toHaveProperty("read")
    expect(result.body.read).toContain("1234");

    const moveResult = await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.READING
        }).expect(200);

    expect(moveResult.body.read).toEqual([]);
    expect(moveResult.body.reading).toContain("1234");
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

it('responds with updated shelves after removing book', async () => {
    const session = await global.signin();

    let res = await request(app)
        .post('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234",
            shelfType: ShelfType.READING
        }).expect(200);

    expect(res.body.reading).toContain("1234");

    res = await request(app)
        .delete('/api/shelf')
        .set("Cookie", session)
        .send({
            bookId: "1234"
        })
        .expect(200)

    expect(res.body.reading).toEqual([]);
})