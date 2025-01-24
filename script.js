let chartInstance = null; // Variable global untuk menyimpan instance chart

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

  // Protein calculation based on activity level
  let proteinPerKg;
  if (activity <= 1.375) {
    proteinPerKg = 0.8; // Sedentary
  } else if (activity <= 1.55) {
    proteinPerKg = 1.0; // Lightly Active
  } else if (activity <= 1.725) {
    proteinPerKg = 1.4; // Moderately Active
  } else {
    proteinPerKg = 2.0; // Very Active
  }

  const dailyProtein = (weight * proteinPerKg).toFixed(1); // Total daily protein intake (in grams)

  // Calculate macronutrient breakdown based on TDEE
  const proteinCalories = (tdee * 0.15).toFixed(0); // 15% of TDEE for protein
  const carbCalories = (tdee * 0.55).toFixed(0); // 55% of TDEE for carbohydrates
  const fatCalories = (tdee * 0.25).toFixed(0); // 25% of TDEE for fats

  // Recommendations for calorie intake
  const maintainWeight = Math.round(tdee);
  const loseWeight = Math.round(tdee - 500); // ~500 calorie deficit
  const gainWeight = Math.round(tdee + 500); // ~500 calorie surplus

  // Display the result
  document.getElementById("result").innerHTML = `
    <div class="card shadow p-4">
      <p>Your TDEE is approximately <strong>${maintainWeight} calories/day</strong>.</p>
      <p>Your ideal weight is approximately <strong>${idealWeight.toFixed(1)} kg</strong>.</p>
      <p>To lose weight: <strong>${loseWeight} calories/day</strong>.</p>
      <p>To gain weight: <strong>${gainWeight} calories/day</strong>.</p>
      <p>Your daily protein intake should be approximately <strong>${dailyProtein} grams</strong>.</p>
      <p>Suggested macronutrient breakdown:</p>
      <ul>
        <li>Protein: <strong>${proteinCalories} calories (~${(proteinCalories / 4).toFixed(0)} grams)</strong></li>
        <li>Carbohydrates: <strong>${carbCalories} calories (~${(carbCalories / 4).toFixed(0)} grams)</strong></li>
        <li>Fats: <strong>${fatCalories} calories (~${(fatCalories / 9).toFixed(0)} grams)</strong></li>
      </ul>
    </div>
  `;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create a new chart
  const ctx = document.getElementById("calorieChart").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Maintain Weight", "Lose Weight", "Gain Weight"],
      datasets: [{
        label: "Calories",
        data: [maintainWeight, loseWeight, gainWeight],
        backgroundColor: ["#3498db", "#e74c3c", "#2ecc71"],
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
});
