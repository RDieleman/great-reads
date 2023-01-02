import request from 'supertest';
import {app} from "../../app";
import {ShelfEvent, ShelfType, Timeline} from "../../models/Timeline";
import {setTimeout} from 'timers/promises';

it('responds with unauthorized if requesting timeline wihtout account', async () => {
    // Request report.
    await request(app)
        .get('/api/timeline?index=0&items=2')
        .expect(401);
})

it('respond with error when invalid data is provided', async () => {
    const items = [
        {index: 0, items: 41},
        {index: -1, items: 20},
        {index: 'test', items: 20},
        {index: 3, items: null},
        {index: null, items: 20},
        {index: 2, items: 'wat'},
    ]

    const session = await global.signin();

    for (const item of items) {
        await request(app)
            .get(`/api/timeline?index=${item.index}&items=${item.items}`)
            .set("Cookie", session)
            .expect(400);
    }
});

it('respond with timeline', async () => {
    const session = await global.signin();

    let index = 0;
    let items = 2;
    let result = await request(app)
        .get(`/api/timeline?index=${index}&items=${items}`)
        .set("Cookie", session)
        .expect(200);

    expect(result.body.shelfEvents).toEqual([]);

    const timeline = await Timeline.findOne();

    const events: ShelfEvent[] = [];

    for (let i = 0; i < 5; i++) {
        events.push({
            bookId: i.toString(),
            targetShelf: ShelfType.READ,
            date: new Date()
        });
        await setTimeout(100);
    }

    events.forEach((e: ShelfEvent) => {
        timeline!.shelfEvents.push(e);
    });
    await timeline!.save();
    index = 0;
    items = 2;
    result = await request(app)
        .get(`/api/timeline?index=${index}&items=${items}`)
        .set("Cookie", session)
        .expect(200);

    expect(result.body.shelfEvents[0].bookId).toEqual(events[4].bookId);
    expect(result.body.shelfEvents[1].bookId).toEqual(events[3].bookId);
    expect(result.body.shelfEvents.length).toEqual(2);

    index = 1;
    items = 2;
    result = await request(app)
        .get(`/api/timeline?index=${index}&items=${items}`)
        .set("Cookie", session)
        .expect(200);

    expect(result.body.shelfEvents[0].bookId).toEqual(events[2].bookId);
    expect(result.body.shelfEvents[1].bookId).toEqual(events[1].bookId);
    expect(result.body.shelfEvents.length).toEqual(2);
})