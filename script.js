// script.js - Final Version with Live Map & Booking System

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Booking State ---
    let userReservedSpotId = null; 
    let reservationTimer = null;
    const RESERVATION_TIME_SECONDS = 120; // 2 minutes reservation lock
    
    // --- Live Map Functionality (for live-map.html) ---
    const spotContainer = document.getElementById('spot-container-a');
    
    if (spotContainer) {
        const availableCountSpan = document.getElementById('available-count');
        const capacityBar = document.getElementById('capacity-bar');
        const bookingAlertDiv = document.getElementById('booking-alert');
        const totalSpots = 18;
        let availableSpots = 12; 
        const initiallyOccupied = [1, 5, 8, 10, 15, 17]; 

        // Function to update the availability count and capacity bar in the UI
        const updateCapacity = () => {
            availableCountSpan.textContent = availableSpots;
            const occupancyPercentage = ((totalSpots - availableSpots) / totalSpots) * 100;
            
            capacityBar.style.width = `${occupancyPercentage.toFixed(0)}%`;
            capacityBar.textContent = `${occupancyPercentage.toFixed(0)}% Occupied`;

            // Change color based on occupancy level
            if (occupancyPercentage < 40) {
                capacityBar.style.backgroundColor = '#33cc66'; 
            } else if (occupancyPercentage < 75) {
                capacityBar.style.backgroundColor = '#ffc107'; 
            } else {
                capacityBar.style.backgroundColor = '#e74c3c'; 
            }
        };

        // --- Alert and Timer Functions ---
        const startReservationTimer = (spotId) => {
            let timeLeft = RESERVATION_TIME_SECONDS;
            
            // Clear any existing timer/alert
            clearInterval(reservationTimer);
            bookingAlertDiv.style.display = 'block';
            bookingAlertDiv.style.backgroundColor = '#33cc66'; // Reset to green
            
            // Set up the countdown
            reservationTimer = setInterval(() => {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                
                bookingAlertDiv.innerHTML = `✅ <strong>Reservation Confirmed!</strong> Spot P${spotId} is locked for ${minutes}:${seconds < 10 ? '0' : ''}${seconds}. <strong>Hurry!</strong>`;

                if (timeLeft <= 30) {
                    bookingAlertDiv.style.backgroundColor = '#f1c40f'; // Warning yellow
                    bookingAlertDiv.innerHTML = `⚠️ <strong>TIME CRITICAL!</strong> Spot P${spotId} reservation expires in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}.`;
                }
                
                if (timeLeft <= 0) {
                    releaseSpot(spotId);
                }

                timeLeft--;
            }, 1000);
        };

        const releaseSpot = (spotId) => {
            clearInterval(reservationTimer);
            
            const spot = document.querySelector(`.parking-spot[data-spot-id="${spotId}"]`);
            if (spot && spot.classList.contains('reserved')) {
                spot.classList.remove('reserved');
                spot.classList.add('available');
                spot.querySelector('.spot-status').textContent = 'FREE';
                spot.addEventListener('click', handleSpotClick);
                availableSpots++;
                userReservedSpotId = null;
                updateCapacity();
            }
            
            // Display expiration alert
            bookingAlertDiv.style.backgroundColor = '#e74c3c';
            bookingAlertDiv.innerHTML = `🚨 <strong>Time Expired!</strong> Reservation for Spot P${spotId} cancelled. It is now available to others.`;

            // Hide the alert bar after a few seconds
            setTimeout(() => {
                bookingAlertDiv.style.display = 'none';
            }, 5000); 
        };
        
        // Function to handle spot clicks (simulation: reserve/release)
        const handleSpotClick = (event) => {
            const spot = event.currentTarget;
            const spotId = parseInt(spot.dataset.spotId);
            const statusSpan = spot.querySelector('.spot-status');

            if (userReservedSpotId !== null) {
                alert(`You already have a reservation for Spot P${userReservedSpotId}. Please arrive or wait for the current reservation to expire.`);
                return;
            }

            if (spot.classList.contains('available')) {
                // Simulate 'reservation'
                spot.classList.remove('available');
                spot.classList.add('reserved');
                statusSpan.textContent = 'RESERVED';
                spot.removeEventListener('click', handleSpotClick);
                
                userReservedSpotId = spotId;
                
                // Start the countdown alert
                startReservationTimer(spotId);
            } 
        };

        // Function to create and render all parking spots
        const renderSpots = () => {
            spotContainer.innerHTML = '';
            
            for (let i = 1; i <= totalSpots; i++) {
                const spot = document.createElement('div');
                spot.classList.add('parking-spot');
                spot.dataset.spotId = i;
                spot.innerHTML = `<span class="spot-label">P${i}</span><span class="spot-status"></span>`;
                
                const statusSpan = spot.querySelector('.spot-status');

                if (initiallyOccupied.includes(i)) {
                    spot.classList.add('occupied');
                    statusSpan.textContent = 'BUSY';
                } else {
                    spot.classList.add('available');
                    statusSpan.textContent = 'FREE';
                    spot.addEventListener('click', handleSpotClick);
                }

                spotContainer.appendChild(spot);
            }
            updateCapacity(); 
        };

        renderSpots();
    }

    // --- Contact Form Submission (for contact.html) ---
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        alert(`Thank you, ${name}! Your message has been received. We will respond to your inquiry shortly.`);
        e.target.reset();
    });
});