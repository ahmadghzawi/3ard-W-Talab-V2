

const productsSchema = new mongoose.Schema(
  {
    seller_id: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    product_category: { type: String, required: true },
    info: String,
    image_path: { type: String, required: true },
    bid: { type: Number, required: true }
  },
  { strict: false }
);

module.exports = mongoose.model("products", productsSchema);
