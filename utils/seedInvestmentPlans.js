

// const mongoose = require("mongoose");
// const InvestmentPlan = require("../models/InvestmentPlan");

// const seedPlans = async () => {
//   const plans = [
//     {
//       name: "Beginner Plan",
//       minAmount: 100,
//       maxAmount: 250,
//       durationDays: 1,
//       interestRate: 10, // Based on range 3,500 - 10,000
//     },
//     {
//       name: "Essential Plan",
//       minAmount: 300,
//       maxAmount: 500,
//       durationDays: 1,
//       interestRate: 15, // Based on range 10,000 - 20,000
//     },
//     {
//       name: "Advanced Plan",
//       minAmount: 600,
//       maxAmount: 1000,
//       durationDays: 1,
//       interestRate: 18, // Based on range 21,000 - 40,000
//     },
//     {
//       name: "Premier Plan",
//       minAmount: 1500,
//       maxAmount: 5000,
//       durationDays: 1,
//       interestRate: 23, // Based on range 45,000 - 100,000
//     },
//   ];

//   try {
//     for (const plan of plans) {
//       const existingPlan = await InvestmentPlan.findOne({ name: plan.name });
//       if (!existingPlan) {
//         await InvestmentPlan.create(plan);
//         console.log(`Added plan: ${plan.name}`);
//       } else {
//         console.log(`Plan ${plan.name} already exists`);
//       }
//     }
//     console.log("Investment plans seeded successfully!");
//   } catch (error) {
//     console.error("Error seeding investment plans:", error);
//   }
// };

// module.exports = seedPlans;

















const mongoose = require("mongoose");
const InvestmentPlan = require("../models/InvestmentPlan");

const seedPlans = async () => {
  const plans = [
    {
      name: "Beginner Plan",
      minAmount: 50,
      maxAmount: 99,
      durationDays: 1,
      interestRate: 1400, // 50 → 750
    },
    {
      name: "Essential Plan",
      minAmount: 100,
      maxAmount: 199,
      durationDays: 1,
      interestRate: 2400, // 100 → 2500
    },
    {
      name: "Advanced Plan",
      minAmount: 200,
      maxAmount: 499,
      durationDays: 1,
      interestRate: 2400, // 200 → 5000
    },
    {
      name: "Premier Plan",
      minAmount: 500,
      maxAmount: 1000,
      durationDays: 1,
      interestRate: 1900, // 500 → 10000
    },
  ];

  try {
    for (const plan of plans) {
      const existingPlan = await InvestmentPlan.findOne({ name: plan.name });
      if (!existingPlan) {
        await InvestmentPlan.create(plan);
        console.log(`✅ Added plan: ${plan.name}`);
      } else {
        console.log(`⚠️ Plan ${plan.name} already exists`);
      }
    }
    console.log("✅ Investment plans seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding investment plans:", error);
  }
};

module.exports = seedPlans;
