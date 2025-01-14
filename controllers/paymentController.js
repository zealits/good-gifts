// controllers/paymentController.js
const paymentsApi = require("../config/square.js");

exports.createPayment = async (req, res) => {
  console.log("Trigger createPayment");
  const { sourceId, amount } = req.body;
  console.log(sourceId, amount);

  try {
    const response = await paymentsApi.createPayment({
      sourceId,
      idempotencyKey: `${Date.now()}`,
      amountMoney: {
        amount: amount,
        currency: "USD",
      },
    });

    // Handle BigInt serialization
    const result = JSON.parse(
      JSON.stringify(response.result, (key, value) => (typeof value === "bigint" ? value.toString() : value))
    );

    console.log("Response: ", response);
    console.log("Result: ", result);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};
