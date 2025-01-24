let chartInstance = null; // Variable global untuk menyimpan instance chart
let weightHistory = []; // Array untuk menyimpan data berat badan

document.getElementById("tdeeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get inputs
  const gender = document.getElementById("gender").value;
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  const activity = parseFloat(document.getElementById("activity").value);

  // Calculate BMR using Harris-Benedict Equation
  let bmr;
  if (gender === "male") {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }

  // Calculate TDEE
  const tdee = bmr * activity;

  // Calculate Ideal Body Weight (Devine Formula)
  let idealWeight;
  if (gender === "male") {
    idealWeight = 50 + 0.9 * (height - 152.4); // For males
  } else {
    idealWeight = 45.5 + 0.9 * (height - 152.4); // For females
  }

  // Recommendations for calorie intake
  const maintainWeight = Math.round(tdee);
  const loseWeight = Math.round(tdee - 500); // ~500 calorie deficit
  const gainWeight = Math.round(tdee + 500); // ~500 calorie surplus

  // Calculate Protein Intake (grams)
  let proteinGrams;
  if (activity <= 1.375) { // Sedentary
    proteinGrams = weight * 0.8;
  } else if (activity <= 1.55) { // Lightly to Moderately Active
    proteinGrams = weight * 1.0;
  } else { // Very Active
    proteinGrams = weight * 1.4;
  }

  // Calculate Macronutrients based on TDEE
  const proteinCalories = maintainWeight * 0.2;  // 20% protein from TDEE
  const carbCalories = maintainWeight * 0.55;    // 55% carbs from TDEE
  const fatCalories = maintainWeight * 0.25;     // 25% fat from TDEE

  const proteinGramsFromCalories = Math.round(proteinCalories / 4); // 1g protein = 4 calories
  const carbGramsFromCalories = Math.round(carbCalories / 4);     // 1g carb = 4 calories
  const fatGramsFromCalories = Math.round(fatCalories / 9);       // 1g fat = 9 calories

  // Calculate BMI
  const bmi = weight / Math.pow(height / 100, 2);

  // Determine BMI category
  let bmiCategory = "";
  let healthWarning = "";
  if (bmi < 18.5) {
    bmiCategory = "Underweight";
    healthWarning = "You are underweight. It's advised to consult with a nutritionist.";
  } else if (bmi >= 18.5 && bmi < 24.9) {
    bmiCategory = "Normal";
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = "Overweight";
    healthWarning = "You are overweight. Consider consulting a nutritionist for a healthy diet.";
  } else {
    bmiCategory = "Obese";
    healthWarning = "You are obese. It's highly recommended to consult with a healthcare provider.";
  }

  // Food Recommendations (based on grams)
  const foodRecommendations = {
    protein: `For ${proteinGrams} grams of protein, you could consume around 200 grams of chicken breast, 2 eggs, or 300 grams of tofu.`,
    carbs: `For ${carbGramsFromCalories} grams of carbs, you could consume around 250 grams of rice, 2 slices of bread, or 300 grams of pasta.`,
    fats: `For ${fatGramsFromCalories} grams of fats, you could consume around 1 avocado, 2 tablespoons of olive oil, or 30 grams of almonds.`
  };

  // Display the result
  document.getElementById("result").innerHTML = `
    <div class="card shadow p-4">
      <p>Your TDEE is approximately <strong>${maintainWeight} calories/day</strong>.</p>
      <p>Your ideal weight is approximately <strong>${idealWeight.toFixed(1)} kg</strong>.</p>
      <p>To lose weight: <strong>${loseWeight} calories/day</strong>.</p>
      <p>To gain weight: <strong>${gainWeight} calories/day</strong>.</p>
      <p>Your daily protein intake: <strong>${proteinGrams.toFixed(1)} grams</strong>.</p>
      <p>Protein food recommendation: <strong>${foodRecommendations.protein}</strong></p>
      <p>Carbohydrates food recommendation: <strong>${foodRecommendations.carbs}</strong></p>
      <p>Fats food recommendation: <strong>${foodRecommendations.fats}</strong></p>
      <p>Your BMI: <strong>${bmi.toFixed(1)}</strong> (${bmiCategory})</p>
      ${healthWarning ? `<p><strong>Health Warning: </strong>${healthWarning}</p>` : ''}
    </div>
  `;

  // Store weight history
  weightHistory.push(weight);

  // Create Weight Trend Chart (line chart)
  if (weightHistory.length > 1) {
    const ctx1 = document.getElementById("weightTrendChart").getContext("2d");
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartInstance = new Chart(ctx1, {
      type: "line",
      data: {
        labels: Array.from({ length: weightHistory.length }, (_, i) => `Entry ${i + 1}`),
        datasets: [{
          label: "Weight Trend",
          data: weightHistory,
          fill: false,
          borderColor: "#3498db",
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // Create Macronutrient Pie Chart
  const ctx2 = document.getElementById("macronutrientPieChart").getContext("2d");
  const macronutrientPieChart = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: ["Protein", "Carbs", "Fats"],
      datasets: [{
        data: [proteinGramsFromCalories, carbGramsFromCalories, fatGramsFromCalories],
        backgroundColor: ["#3498db", "#f39c12", "#2ecc71"],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + ' g';
            }
          }
        }
      }
    }
  });
});
