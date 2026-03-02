// Main function to search country
async function searchCountry(countryName) {
    const countryInput = document.getElementById("country-input");
    const countryInfo = document.getElementById("country-info");
    const spinner = document.getElementById("loading-spinner");
    const borderSection = document.getElementById("bordering-countries");
    const errorMessage = document.getElementById("error-message");

    try {
        // Show spinner and hide content/errors
        spinner.classList.remove('hidden');
        countryInfo.classList.add('hidden');
        borderSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        borderSection.innerHTML = '';

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        const country = data[0];

        // Update country info DOM
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="100" alt="${country.name.common} flag">
        `;
        countryInfo.classList.remove('hidden');

        // Fetch bordering countries
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderSection.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" width="50" alt="${borderCountry.name.common} flag">
                    </div>
                `;
            }
        } else {
            borderSection.innerHTML = '<p>No bordering countries</p>';
        }
        borderSection.classList.remove('hidden');

    } catch (error) {
        // Show error message
        errorMessage.textContent = 'Country not found. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide spinner
        spinner.classList.add('hidden');
    }
}

// Event listeners for button click & Enter key
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) searchCountry(country);
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = document.getElementById('country-input').value.trim();
        if (country) searchCountry(country);
    }
});