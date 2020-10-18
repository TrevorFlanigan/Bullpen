import request from "supertest";
import app from "../server";
import mongoose from "mongoose";



beforeAll(() => {

});


describe('GET /api/users', function () {
    test('responds with json', async (done) => {
        let res = await request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);

        let json = res.body;
        console.log(json);

    });
});



afterAll(() => {
    if (mongoose.connection.name == "bullpen-test")
        mongoose.connection.dropDatabase();
})