const graphql = require("graphql");
const _ = require("lodash");
const Account = require("../models/account");
const Bee = require("../models/bee");
const Flower = require("../models/flower");
const MongoDb = require("mongodb");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const AccountType = new GraphQLObjectType({
  name: "Account",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },

    bee: {
      type: BeeType,
      resolve(parent, args) {
        console.log(parent);
        return Bee.findOne({ beeId: parent._id });
        // return _.find(dummyBeeData, { id: parent.beeId });
      },
    },
    flower: {
      type: FlowerType,
      resolve(parent, args) {
        console.log(parent._id);
        return Flower.findOne({ flowerId: parent._id });
        // return _.find(dummyFlowerData, { id: parent.flowerId });
      },
    },
  }),
});

const FlowerType = new GraphQLObjectType({
  name: "Flower",
  fields: () => ({
    flowerId: { type: GraphQLID },
    phone: { type: GraphQLString },
    inviteCode: { type: GraphQLString },
  }),
});
const BeeType = new GraphQLObjectType({
  name: "Bee",
  fields: () => ({
    beeId: { type: GraphQLID },
    businessPhone: { type: GraphQLString },
    businessName: { type: GraphQLString },
    businessDescription: { type: GraphQLString },
    rating: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    account: {
      type: AccountType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Account.findById(args.id);
        //code to get to get from db
        // return _.find(dummyData, { id: args.id });
      },
    },
    flower: {
      type: FlowerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Flower.findById(args.id);
        //code to get to get from db
        // return _.find(dummyData, { id: args.id });
      },
    },
    bee: {
      type: BeeType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Bee.findById(args.id);
        // return _.find(dummyBeeData, { id: args.id });
      },
    },
    accounts: {
      type: new GraphQLList(AccountType),
      resolve(parent, args) {
        return Account.find({});
        // return dummyData;
      },
    },
    bees: {
      type: new GraphQLList(BeeType),
      resolve(parent, args) {
        return Bee.find({});
        // return dummyBeeData;
      },
    },
    searchBee: {
      type: new GraphQLList(BeeType),
      args: { query: { type: GraphQLString } },
      resolve(parent, args) {
        console.log(args);

        let a = Bee.collection.find({ ...args.query });
        return a.forEach((e) => console.log(e));
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAccount: {
      type: AccountType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        // flowerId: { type: GraphQLString },
        // beeId: { type: GraphQLString },
      },

      resolve(parent, args) {
        let flowerId = Math.floor(Math.random() * 100 + 10000);
        let ObjectID = MongoDb.ObjectID;

        let _objectId = new ObjectID();

        let account = new Account({
          _id: _objectId,
          flowerId: _objectId,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          //   flowerId: args.GraphQLString,
          //   beeId: args.GraphQLString,
        });

        // let beeId = Math.random() * 100 + 10000;

        let flower = new Flower({
          flowerId: _objectId,
          phone: args.phone,
          inviteCode: args.firstName + "Flower5etc",
        });
        let bee = new Bee({
          beeId: _objectId,
        });
        flower.save();
        bee.save();
        return account.save();
      },
    },
    addFlower: {
      type: FlowerType,
      args: {
        flowerId: { type: GraphQLID },
        phone: { type: GraphQLString },
        inviteCode: { type: GraphQLString },
      },
      resolve(parent, args) {
        let flower = new Flower({
          flowerId: args.flowerId,
          phone: args.phone,
          inviteCode: args.inviteCode,
        });

        return flower.save();
      },
    },
    addBee: {
      type: BeeType,
      args: {
        beeId: { type: GraphQLID },
        businessPhone: { type: GraphQLString },
        businessName: { type: GraphQLString },
        businessDescription: { type: GraphQLString },
        rating: { type: GraphQLString },
      },
      resolve(parent, args) {
        let beeData = new Bee({
          beeId: args.beeId,
          businessPhone: args.businessPhone,
          businessName: args.businessName,
          businessDescription: args.businessDescription,
          rating: args.rating,
        });

        var upsertData = beeData.toObject();

        Bee.findOne({ beeId: args.beeId }, upsertData, (err) =>
          console.error(err)
        );
        return true;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
