const Mongo  = require ("mongodb")
const Router = require ("koa-router")


const all = collection => async ctx =>
    ctx.body = await ctx.db.collection(collection).find({}).toArray()

const getById = collection => async ctx => {
    const res = await ctx.db.collection(collection).findOne({ _id: Mongo.ObjectId (ctx.params.id) })
    ctx.body = res || { error: "Not found" }
}

const insert = collection => async ctx => {
    await ctx.db.collection(collection).insertOne (ctx.request.body)
    ctx.body = { status: "success" }
}

const update = collection => async ctx => {
    const res = await ctx.db.collection(collection).updateOne({ _id: Mongo.ObjectId (ctx.params.id) }, { $set: ctx.request.body })
    ctx.body = res.result.n === 1
        ? { status : "success"              }
        : { error  : "something went wrong" }
}

const delete_ = collection => async ctx => {
    const res = await ctx.db.collection(collection).deleteOne({ _id: Mongo.ObjectId (ctx.params.id) })
    ctx.body = res.result.n === 1
        ? { status : "success"              }
        : { error  : "something went wrong" }
}


module.exports = (collection, middleware) => {

    const router = new Router ({ prefix: `/${collection}` })
    
    if (middleware) router.use (middleware)

    return router
        .get    ("/",    all     (collection))
        .get    ("/:id", getById (collection))
        .post   ("/",    insert  (collection))
        .put    ("/:id", update  (collection))
        .delete ("/:id", delete_ (collection))
}
