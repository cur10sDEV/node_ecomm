const Order = require("../models/order");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

// get all products - product list page
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/productList.ejs", {
      products,
      pageTitle: "Products",
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Product details Page
const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("shop/productDetails.ejs", {
      product,
      pageTitle: `${product.title}`,
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Index - Home Page
const getHome = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index.ejs", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// get cart page
const getCart = async (req, res, next) => {
  try {
    const { cart } = await req.user.populate("cart.items.productId");
    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      products: cart.items,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// add product to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    req.user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// delete cart item
const deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.deleteCartItem(productId);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders: orders,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    });
    const order = new Order({
      user: {
        username: req.user.username,
        userId: req.user._id,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCartItems();
    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Order-Invoice
const getOrderInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      return next(new Error("No order found!"));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error("Unauthorized"));
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join(
      __dirname,
      "..",
      "data",
      "orders",
      "invoices",
      invoiceName
    );
    // create invoice pdf on the fly
    const pdfDoc = new pdfDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text(`Invoice - #${orderId}`, {
      align: "center",
    });
    pdfDoc.text("------------------------------------------------------");
    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.product.price * prod.quantity;
      pdfDoc
        .fontSize(18)
        .text(
          `${prod.product.title} - $${prod.product.price} x ${prod.quantity}`
        );
    });
    pdfDoc
      .fontSize(26)
      .text("------------------------------------------------------");
    pdfDoc.fontSize(20).text(`Total Price: $${totalPrice.toFixed(2)}`);
    pdfDoc.end();
    // preload data
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     `attachment; filename=${invoiceName}`
    //   );
    //   res.send(data);
    // });

    // stream data
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", `attachment; filename=${invoiceName}`);
    // file.pipe(res);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// Checkout
const getCheckout = (req, res, next) => {
  try {
    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = {
  getProducts,
  getHome,
  getCart,
  getCheckout,
  getOrders,
  getOrderInvoice,
  getProductDetails,
  addToCart,
  deleteCartItem,
  postOrder,
};
