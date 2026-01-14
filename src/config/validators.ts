import mongoose from "mongoose";

// true si id es un ObjectId valido de MongoDb
// false si is NO es valido
export class Validators {
  static isMongoId(id: string) {
    return mongoose.isValidObjectId(id);
  }
}
