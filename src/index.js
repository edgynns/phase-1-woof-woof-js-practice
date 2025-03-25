// index.js
document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    let isFilterOn = false;

    // Fetch all dogs
    async function fetchDogs() {
        try {
            const response = await fetch('http://localhost:3000/pups');
            const dogs = await response.json();
            renderDogBar(dogs);
        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
    }

    // Render dogs in the dog bar
    function renderDogBar(dogs, filtered = false) {
        dogBar.innerHTML = ''; // Clear existing dogs
        const dogsToRender = filtered ? dogs.filter(dog => dog.isGoodDog) : dogs;
        
        dogsToRender.forEach(dog => {
            const dogSpan = document.createElement('span');
            dogSpan.textContent = dog.name;
            dogSpan.addEventListener('click', () => showDogDetails(dog));
            dogBar.appendChild(dogSpan);
        });
    }

    // Show dog details when clicked
    function showDogDetails(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" />
            <h2>${dog.name}</h2>
            <button id="good-bad-toggle">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;

        const toggleButton = document.getElementById('good-bad-toggle');
        toggleButton.addEventListener('click', () => toggleDogStatus(dog));
    }

    // Toggle dog's good/bad status
    async function toggleDogStatus(dog) {
        try {
            const response = await fetch(`http://localhost:3000/pups/${dog.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ isGoodDog: !dog.isGoodDog })
            });

            const updatedDog = await response.json();
            showDogDetails(updatedDog);
            
            // Refresh dog bar with current filter state
            fetchDogs();
        } catch (error) {
            console.error('Error updating dog status:', error);
        }
    }

    // Filter good dogs
    function toggleGoodDogFilter() {
        isFilterOn = !isFilterOn;
        filterButton.textContent = `Filter good dogs: ${isFilterOn ? 'ON' : 'OFF'}`;
        
        // Fetch and render dogs with current filter state
        fetchDogs();
    }

    // Event listener for filter button
    filterButton.addEventListener('click', toggleGoodDogFilter);

    // Initial fetch of dogs
    fetchDogs();
});