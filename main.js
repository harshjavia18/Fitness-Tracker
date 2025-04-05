// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// BMI Calculator
const calculateBtn = document.getElementById('calculate-bmi');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const bmiResult = document.getElementById('bmi-result');

calculateBtn.addEventListener('click', () => {
    const height = parseFloat(heightInput.value) / 100; // Convert cm to meters
    const weight = parseFloat(weightInput.value);
    
    if (height && weight && height > 0 && weight > 0) {
        const bmi = weight / (height * height);
        const category = getBMICategory(bmi);
        const color = getBMIColor(bmi);
        
        bmiResult.innerHTML = `
            <div class="bmi-result" style="color: ${color}">
                <h3>Your BMI: ${bmi.toFixed(1)}</h3>
                <p class="bmi-category">Category: ${category}</p>
                <div class="bmi-ranges">
                    <div class="range-item ${bmi < 18.5 ? 'active' : ''}">
                        <span class="range-label">Underweight</span>
                        <span class="range-value">&lt; 18.5</span>
                    </div>
                    <div class="range-item ${bmi >= 18.5 && bmi < 25 ? 'active' : ''}">
                        <span class="range-label">Normal</span>
                        <span class="range-value">18.5 - 24.9</span>
                    </div>
                    <div class="range-item ${bmi >= 25 && bmi < 30 ? 'active' : ''}">
                        <span class="range-label">Overweight</span>
                        <span class="range-value">25 - 29.9</span>
                    </div>
                    <div class="range-item ${bmi >= 30 ? 'active' : ''}">
                        <span class="range-label">Obese</span>
                        <span class="range-value">&ge; 30</span>
                    </div>
                </div>
                <div class="bmi-advice">
                    <i class="fas fa-lightbulb"></i>
                    ${getBMIAdvice(category)}
                </div>
            </div>
        `;
        
        bmiResult.classList.add('show');
    } else {
        bmiResult.innerHTML = '<p class="error">Please enter valid height and weight</p>';
        bmiResult.classList.add('show');
    }
});

function getBMICategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function getBMIColor(bmi) {
    if (bmi < 18.5) return '#2196F3';
    if (bmi < 25) return '#4CAF50';
    if (bmi < 30) return '#FFC107';
    return '#F44336';
}

function getBMIAdvice(category) {
    const advice = {
        'Underweight': 'Focus on nutrient-dense foods and strength training to gain healthy weight.',
        'Normal weight': 'Maintain your healthy lifestyle with balanced diet and regular exercise.',
        'Overweight': 'Focus on portion control and increase physical activity to achieve a healthy weight.',
        'Obese': 'Consult with a healthcare provider for a personalized weight management plan.'
    };
    return advice[category];
}

// Daily Fitness Tips Carousel
const tips = [
    'Stay hydrated! Aim for 8 glasses of water daily.',
    'Include protein in every meal to maintain muscle mass.',
    'Get at least 7-8 hours of sleep for optimal recovery.',
    'Take the stairs instead of the elevator when possible.',
    'Include colorful vegetables in your diet for essential nutrients.'
];

let currentTip = 0;
const tipsCarousel = document.querySelector('.tips-carousel');

function updateTip() {
    if (tipsCarousel) {
        tipsCarousel.innerHTML = `
            <div class="tip" style="animation: fadeIn 0.5s ease-out">
                <p>${tips[currentTip]}</p>
            </div>
        `;
        currentTip = (currentTip + 1) % tips.length;
    }
}

if (tipsCarousel) {
    updateTip();
    setInterval(updateTip, 5000);
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Scroll Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.workout-card, .calculator-container, .nutrition-container').forEach(el => {
    observer.observe(el);
});

// Calorie Tracker
const mealType = document.getElementById('meal-type');
const foodItem = document.getElementById('food-item');
const calorieAmount = document.getElementById('calorie-amount');
const addFoodBtn = document.getElementById('add-food');
const quickAddBtn = document.getElementById('show-quick-add');
const totalCaloriesSpan = document.getElementById('total-calories');
const calorieProgress = document.getElementById('calorie-progress');

// Meal category elements
const mealCategories = {
    breakfast: document.getElementById('breakfast-items'),
    lunch: document.getElementById('lunch-items'),
    dinner: document.getElementById('dinner-items'),
    snacks: document.getElementById('snacks-items')
};

const mealTotals = {
    breakfast: document.getElementById('breakfast-total'),
    lunch: document.getElementById('lunch-total'),
    dinner: document.getElementById('dinner-total'),
    snacks: document.getElementById('snacks-total')
};

// Initialize meal data
let meals = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
};

// Load saved meals from localStorage
function loadSavedMeals() {
    const savedMeals = localStorage.getItem('meals');
    if (savedMeals) {
        meals = JSON.parse(savedMeals);
        Object.keys(meals).forEach(mealType => {
            meals[mealType].forEach(item => {
                addFoodItemToList(item.name, item.calories, mealType);
            });
        });
        updateAllTotals();
    }
}

// Save meals to localStorage
function saveMeals() {
    localStorage.setItem('meals', JSON.stringify(meals));
}

// Add food item to specific meal list
function addFoodItemToList(foodName, calories, mealType) {
    const foodList = mealCategories[mealType].querySelector('.food-list');
    const foodItem = document.createElement('div');
    foodItem.className = 'food-item';
    foodItem.innerHTML = `
        <span>${foodName} - ${calories} cal</span>
        <button class="delete-btn" onclick="removeFoodItem(this, '${mealType}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    foodList.appendChild(foodItem);
    
    // Add animation
    foodItem.style.animation = 'slideIn 0.3s ease forwards';
}

// Remove food item
function removeFoodItem(button, mealType) {
    const foodItem = button.parentElement;
    const foodList = foodItem.parentElement;
    const index = Array.from(foodList.children).indexOf(foodItem);
    
    // Remove from data
    meals[mealType].splice(index, 1);
    saveMeals();
    
    // Add removal animation
    foodItem.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        foodList.removeChild(foodItem);
        updateMealTotal(mealType);
        updateTotalCalories();
    }, 300);
}

// Update meal total
function updateMealTotal(mealType) {
    const total = meals[mealType].reduce((sum, item) => sum + item.calories, 0);
    const totalSpan = mealCategories[mealType].querySelector('.meal-total span');
    mealTotals[mealType].textContent = `${total} cal`;
    totalSpan.textContent = total;
    return total;
}

// Update all totals
function updateAllTotals() {
    let totalCalories = 0;
    Object.keys(meals).forEach(mealType => {
        totalCalories += updateMealTotal(mealType);
    });
    
    // Update total calories
    totalCaloriesSpan.textContent = totalCalories;
    
    // Update progress bar
    const dailyGoal = 2000;
    const percentage = (totalCalories / dailyGoal) * 100;
    calorieProgress.style.width = `${Math.min(percentage, 100)}%`;
    
    // Update progress bar color based on percentage
    if (percentage > 100) {
        calorieProgress.style.background = 'var(--secondary-color)';
    } else if (percentage > 85) {
        calorieProgress.style.background = 'var(--accent-color)';
    } else {
        calorieProgress.style.background = 'var(--gradient-2)';
    }
}

// Add food event listener
addFoodBtn.addEventListener('click', () => {
    const name = foodItem.value.trim();
    const calories = parseInt(calorieAmount.value);
    const type = mealType.value;
    
    if (name && !isNaN(calories) && calories > 0) {
        // Add to data
        meals[type].push({ name, calories });
        saveMeals();
        
        // Add to UI
        addFoodItemToList(name, calories, type);
        updateAllTotals();
        
        // Clear inputs
        foodItem.value = '';
        calorieAmount.value = '';
        foodItem.focus();
    }
});

// Quick add common foods
const commonFoods = {
    breakfast: [
        { name: 'Oatmeal', calories: 150 },
        { name: 'Banana', calories: 105 },
        { name: 'Eggs (2)', calories: 140 }
    ],
    lunch: [
        { name: 'Chicken Sandwich', calories: 350 },
        { name: 'Caesar Salad', calories: 250 },
        { name: 'Turkey Wrap', calories: 300 }
    ],
    dinner: [
        { name: 'Grilled Chicken', calories: 250 },
        { name: 'Brown Rice', calories: 200 },
        { name: 'Steamed Vegetables', calories: 100 }
    ],
    snacks: [
        { name: 'Apple', calories: 95 },
        { name: 'Almonds (1oz)', calories: 164 },
        { name: 'Greek Yogurt', calories: 120 }
    ]
};

// Show quick add modal
quickAddBtn.addEventListener('click', () => {
    const type = mealType.value;
    const foods = commonFoods[type];
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'quick-add-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h4>Quick Add ${type.charAt(0).toUpperCase() + type.slice(1)}</h4>
            <div class="common-foods">
                ${foods.map(food => `
                    <button class="quick-food-btn" data-name="${food.name}" data-calories="${food.calories}">
                        ${food.name} (${food.calories} cal)
                    </button>
                `).join('')}
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelectorAll('.quick-food-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const calories = parseInt(btn.dataset.calories);
            
            meals[type].push({ name, calories });
            saveMeals();
            addFoodItemToList(name, calories, type);
            updateAllTotals();
            
            document.body.removeChild(modal);
        });
    });
});

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .quick-add-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
    }
    
    .modal-content h4 {
        margin-bottom: 1rem;
        color: var(--primary-color);
    }
    
    .common-foods {
        display: grid;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .quick-food-btn {
        padding: 0.8rem;
        border: 1px solid #E1E1E1;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quick-food-btn:hover {
        background: var(--light-bg);
        border-color: var(--primary-color);
    }
    
    .close-modal {
        width: 100%;
        padding: 0.8rem;
        background: var(--gradient-1);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }
`;
document.head.appendChild(modalStyles);

// Add slide animations
const slideAnimations = document.createElement('style');
slideAnimations.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
`;
document.head.appendChild(slideAnimations);

// Load saved meals on page load
loadSavedMeals();

// Add testimonials section
const testimonials = [
    {
        name: "Vasu",
        rating: 5,
        image: "assets/testimonial1.jpg",
        text: "Absolutely love the workout plans! I have been using this website for a couple of months now, and its amazing! The workout plans are well-structured, and I can see the results already. The visuals and exercise explanations are so helpful. Definitely recommend it!",
        achievement: "Lost 15kg in 3 months"
    },
    {
        name: "Daksh",
        rating: 5,
        image: "assets/testimonial2.jpg",
        text: "Convenient and effective! This site fits my busy schedule perfectly. I can customize my weekly plans, and the guidance is top-notch. My favorite part is the tips on improving form, which made a huge difference in my results.",
        achievement: "Gained muscle mass"
    },
    {
        name: "Kushal",
        rating: 4,
        image: "assets/testimonial3.jpg",
        text: "Perfect for beginners and pros alike! As a beginner, I was nervous about starting my fitness journey. This website made it so easy to follow the workout plans and understand proper form with their videos. Super helpful!",
        achievement: "Improved overall fitness"
    }
];

function initializeTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        testimonialsContainer.innerHTML = `
            <div class="testimonials-grid">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-header">
                            <div class="testimonial-image">
                                <img src="${testimonial.image}" alt="${testimonial.name}">
                            </div>
                            <div class="testimonial-info">
                                <h3>${testimonial.name}</h3>
                                <div class="rating">
                                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}
                                </div>
                            </div>
                        </div>
                        <div class="testimonial-content">
                            <p class="testimonial-text">"${testimonial.text}"</p>
                            <div class="achievement">
                                <i class="fas fa-trophy"></i>
                                <span>${testimonial.achievement}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Add testimonial styles
const testimonialStyles = document.createElement('style');
testimonialStyles.textContent = `
    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
    }

    .testimonial-card {
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .testimonial-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .testimonial-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .testimonial-image {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 1rem;
        border: 3px solid var(--primary-color);
    }

    .testimonial-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .testimonial-info h3 {
        margin: 0;
        color: var(--text-color);
        font-size: 1.2rem;
    }

    .rating {
        color: #ffc107;
        font-size: 1.2rem;
        margin-top: 0.5rem;
    }

    .testimonial-text {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-style: italic;
    }

    .achievement {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary-color);
        font-weight: 500;
    }

    .achievement i {
        color: #ffc107;
    }

    @media (max-width: 768px) {
        .testimonials-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(testimonialStyles);

// Exercise Showcase
const exerciseShowcase = {
    beginner: [
        {
            name: "Jumping Jacks",
            duration: "30 seconds",
            calories: "8-10 cal/min",
            steps: [
                "Stand with feet together, arms at sides",
                "Jump and spread legs while raising arms",
                "Jump back to starting position",
                "Repeat with high energy"
            ],
            tips: "Keep a steady rhythm and land softly",
            icon: "🏃‍♂️",
            intensity: "Low",
            target: "Full Body"
        },
        {
            name: "Mountain Climbers",
            duration: "45 seconds",
            calories: "10-12 cal/min",
            steps: [
                "Start in plank position",
                "Drive knees alternately to chest",
                "Keep core tight throughout",
                "Maintain quick pace"
            ],
            tips: "Keep your hips level and don't bounce",
            icon: "⛰️",
            intensity: "Medium",
            target: "Core, Cardio"
        },
        {
            name: "Body Weight Squats",
            duration: "12-15 reps",
            calories: "8-10 cal/min",
            steps: [
                "Stand with feet shoulder-width apart",
                "Lower body as if sitting back",
                "Keep chest up, knees aligned",
                "Push through heels to stand"
            ],
            tips: "Don't let knees cave inward",
            icon: "💪",
            intensity: "Medium",
            target: "Legs, Core"
        }
    ],
    intermediate: [
        {
            name: "Burpees",
            duration: "10 reps",
            calories: "15-20 cal/min",
            steps: [
                "Start standing, drop to plank",
                "Perform a push-up",
                "Jump feet forward to squat",
                "Explosive jump with arms up"
            ],
            tips: "Modify by stepping instead of jumping",
            icon: "🔥",
            intensity: "High",
            target: "Full Body"
        },
        {
            name: "Plank Variations",
            duration: "60 seconds total",
            calories: "5-7 cal/min",
            steps: [
                "Standard plank (20s)",
                "Side plank right (20s)",
                "Side plank left (20s)",
                "Hold each position steady"
            ],
            tips: "Keep body in straight line",
            icon: "🏋️‍♂️",
            intensity: "Medium",
            target: "Core, Shoulders"
        }
    ],
    advanced: [
        {
            name: "Plyometric Push-ups",
            duration: "8-10 reps",
            calories: "12-15 cal/min",
            steps: [
                "Start in push-up position",
                "Lower body to ground",
                "Push explosively to lift hands",
                "Land softly and repeat"
            ],
            tips: "Start with regular push-ups first",
            icon: "💥",
            intensity: "Very High",
            target: "Chest, Arms"
        },
        {
            name: "HIIT Sprint Intervals",
            duration: "15 minutes",
            calories: "15-20 cal/min",
            steps: [
                "Sprint at maximum effort (30s)",
                "Walk or light jog (30s)",
                "Repeat for 15 minutes",
                "Cool down with light walk"
            ],
            tips: "Start with shorter intervals if needed",
            icon: "🏃",
            intensity: "Very High",
            target: "Cardio, Legs"
        }
    ]
};

function updateExerciseSection() {
    const exerciseContainer = document.querySelector('.exercise-showcase');
    if (exerciseContainer) {
        exerciseContainer.innerHTML = `
            <h4><i class="fas fa-dumbbell"></i> Exercise Library</h4>
            <div class="difficulty-tabs">
                <button class="tab-btn active" data-level="beginner">Beginner</button>
                <button class="tab-btn" data-level="intermediate">Intermediate</button>
                <button class="tab-btn" data-level="advanced">Advanced</button>
            </div>
            
            <div class="exercise-cards">
                ${exerciseShowcase.beginner.map(exercise => createExerciseCard(exercise)).join('')}
            </div>
        `;
        
        // Add event listeners for difficulty tabs
        const tabBtns = exerciseContainer.querySelectorAll('.difficulty-tabs .tab-btn');
        const exerciseCards = exerciseContainer.querySelector('.exercise-cards');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const level = btn.dataset.level;
                exerciseCards.innerHTML = exerciseShowcase[level].map(exercise => 
                    createExerciseCard(exercise)
                ).join('');
                
                // Add animation to new cards
                const cards = exerciseCards.querySelectorAll('.exercise-card');
                cards.forEach((card, index) => {
                    card.style.animation = `fadeInUp 0.3s ease forwards ${index * 0.1}s`;
                });
            });
        });
    }
}

function createExerciseCard(exercise) {
    return `
        <div class="exercise-card">
            <div class="exercise-header">
                <span class="exercise-icon">${exercise.icon}</span>
                <h5>${exercise.name}</h5>
                <span class="intensity ${exercise.intensity.toLowerCase().replace(' ', '-')}">${exercise.intensity}</span>
            </div>
            <div class="exercise-details">
                <div class="detail-row">
                    <span><i class="fas fa-clock"></i> ${exercise.duration}</span>
                    <span><i class="fas fa-fire"></i> ${exercise.calories}</span>
                </div>
                <div class="detail-row">
                    <span><i class="fas fa-bullseye"></i> ${exercise.target}</span>
                </div>
            </div>
            <div class="exercise-steps">
                <h6>Steps:</h6>
                <ol>
                    ${exercise.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            <div class="exercise-tip">
                <i class="fas fa-lightbulb"></i>
                <p>${exercise.tips}</p>
            </div>
            <button class="start-exercise-btn" onclick="startExercise('${exercise.name}')">
                <i class="fas fa-play"></i> Start Exercise
            </button>
        </div>
    `;
}

function startExercise(exerciseName) {
    // Create a modal for the exercise timer
    const modal = document.createElement('div');
    modal.className = 'exercise-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${exerciseName}</h3>
            <div class="timer">00:00</div>
            <div class="controls">
                <button class="start-timer">Start</button>
                <button class="pause-timer">Pause</button>
                <button class="reset-timer">Reset</button>
            </div>
            <button class="close-modal">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    let timer;
    let seconds = 0;
    let isRunning = false;

    const timerDisplay = modal.querySelector('.timer');
    const startBtn = modal.querySelector('.start-timer');
    const pauseBtn = modal.querySelector('.pause-timer');
    const resetBtn = modal.querySelector('.reset-timer');
    const closeBtn = modal.querySelector('.close-modal');

    function updateTimer() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                seconds++;
                updateTimer();
            }, 1000);
        }
    });

    pauseBtn.addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        seconds = 0;
        updateTimer();
    });

    closeBtn.addEventListener('click', () => {
        clearInterval(timer);
        document.body.removeChild(modal);
    });
}

// Add exercise styles
const exerciseStyles = document.createElement('style');
exerciseStyles.textContent = `
    .exercise-showcase {
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 16px;
        margin-top: 2rem;
        box-shadow: var(--shadow-md);
    }

    .difficulty-tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .difficulty-tabs .tab-btn {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 25px;
        background: var(--light-bg);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .difficulty-tabs .tab-btn.active {
        background: var(--gradient-1);
        color: white;
    }

    .exercise-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .exercise-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }

    .exercise-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-md);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .exercise-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .exercise-modal .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 16px;
        text-align: center;
    }

    .exercise-modal .timer {
        font-size: 3rem;
        font-weight: bold;
        margin: 2rem 0;
        color: var(--primary-color);
    }

    .exercise-modal .controls {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .exercise-modal button {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .exercise-modal .start-timer { background: var(--gradient-1); color: white; }
    .exercise-modal .pause-timer { background: var(--accent-color); color: white; }
    .exercise-modal .reset-timer { background: var(--secondary-color); color: white; }
    .exercise-modal .close-modal { background: #666; color: white; }

    .exercise-modal button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
    }
`;
document.head.appendChild(exerciseStyles);

// Initialize exercise section
document.addEventListener('DOMContentLoaded', updateExerciseSection);

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', () => {
    updateTipsSection();
    updateCalorieTracker();
    loadSavedFoodItems();
    initializeTestimonials();
    
    // Update tips section periodically
    setInterval(updateTipsSection, 30000);
    
    // Add event listener for the food addition
    if (addFoodBtn) {
        addFoodBtn.addEventListener('click', () => {
            const name = foodItem.value.trim();
            const calories = parseInt(calorieAmount.value);
            
            if (name && !isNaN(calories) && calories > 0) {
                addFoodItemToList(name, calories);
                foodItem.value = '';
                calorieAmount.value = '';
                foodItem.focus();
            } else {
                // Show error message
                const errorMsg = document.createElement('div');
                errorMsg.classList.add('error-message');
                errorMsg.textContent = 'Please enter valid food name and calories';
                errorMsg.style.color = 'var(--secondary-color)';
                errorMsg.style.fontSize = '0.9rem';
                errorMsg.style.marginTop = '0.5rem';
                
                const existingError = document.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                addFoodBtn.parentElement.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 3000);
            }
        });
    }
});

// Exercise Showcase Toggle
const showExercisesBtn = document.getElementById('show-exercises');
const exerciseShowcaseSection = document.querySelector('.exercise-showcase');

showExercisesBtn.addEventListener('click', () => {
    if (exerciseShowcaseSection.style.display === 'none') {
        exerciseShowcaseSection.style.display = 'block';
        setTimeout(() => {
            exerciseShowcaseSection.classList.add('show');
        }, 10);
        showExercisesBtn.innerHTML = `
            <i class="fas fa-times"></i>
            Hide Exercise Library
        `;
    } else {
        exerciseShowcaseSection.classList.remove('show');
        setTimeout(() => {
            exerciseShowcaseSection.style.display = 'none';
        }, 500);
        showExercisesBtn.innerHTML = `
            <i class="fas fa-dumbbell"></i>
            View Exercise Library
        `;
    }
});

// Input validation and formatting
heightInput.addEventListener('input', (e) => {
    let value = e.target.value;
    if (value.length > 0) {
        value = Math.max(0, Math.min(300, value)); // Limit height between 0-300 cm
        e.target.value = value;
    }
});

weightInput.addEventListener('input', (e) => {
    let value = e.target.value;
    if (value.length > 0) {
        value = Math.max(0, Math.min(500, value)); // Limit weight between 0-500 kg
        e.target.value = value;
    }
}); 