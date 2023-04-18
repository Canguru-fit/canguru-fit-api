import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let unit = new Schema(
  {
    id: Number,
    name: String,
    name2: String,
    name3: String,
    ownerId: {
      type: Number,
      default: null,
    },
    deleted: {
      type: Boolean,
      default: false,
    }
  }
);

let roomTypes = new Schema(
  {
    id: Number,
    propertyId: Number,
    name: String,
    qty: Number,
    minPrice: Number,
    maxPeople: Number,
    maxAdult: Number,
    maxChildren: Number,
    taxPercentage: Number,
    taxPerson: Number,
    rackRate: Number,
    cleaningFee: Number,
    securityDeposit: Number,
    sellPriority: Number,
    roomSize: Number,
    highlightColor: String,
    includeInReports: Boolean,
    overbookingProtection: String,
    blockAfterCheckOutDays: Number,
    controlPriority: Number,
    dependencies: Object,
    templates: Object,
    unitAllocation: String,
    unallocatedUnit: Object,
    units: [unit],
    featureCodes: Array,
    deleted: {
      type: Boolean,
      default: false,
    }
  }
);

let properties = new Schema(
  {
    id: Number,
    account: Object,
    name: String,
    propertyType: String,
    currency: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postcode: String,
    latitude: String,
    longitude: String,
    phone: String,
    mobile: String,
    fax: String,
    email: String,
    web: String,
    checkInStart: String,
    checkInEnd: String,
    checkOutEnd: String,
    offerType: String,
    sellPriority: Number,
    bookingPageMultiplier: String,
    permit: String,
    roomChargeDisplay: String,
    templates: Object,
    bookingRules: Object,
    paymentCollection: Object,
    paymentGateways: Object,
    cardSettings: Object,
    groupKeywords: Array,
    oneTimeVouchers: Array,
    discountVouchers: Array,
    featureCodes: Array,
    bookingQuestions: Object,
    roomTypes: [roomTypes],
    deleted: {
      type: Boolean,
      default: false,
    }
  },
  { collection: 'Properties' }
);

export default mongoose.model('properties', properties);


