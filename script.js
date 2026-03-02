const input = document.getElementById("country-input");
const button = document.getElementById("search-btn");
const countryInfo = document.getElementById("country-info");
const spinner = document.getElementById("loading-spinner");
const borderSection = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");

async function searchCountry(countryName) {
    try {
        // Show loading spinner
        spinner.classList.remove("hidden");
        errorMessage.classList.add("hidden");
        countryInfo.classList.add("hidden");
        borderSection.classList.add("hidden");
        borderSection.innerHTML = "";

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error("Country not found");
        const data = await response.json();
        const country = data[0];


        // Update DOM
        countryInfo,innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" width="100">
            `;
            countryInfo.classList.remove("hidden");


        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
               const borderResponse = await fetch(`https://restcountries.com/v3.1/name/${code}`);
               const borderData = await borderResponse.json();
               const borderCountry = borderData[0];

               borderSection.innerHTML += `
               <div>
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" width="50">
                    </div>

               `;
            }

            borderSection.classList.remove("hidden");
        }
        // Update bordering countries section
    } catch (error) {
        // Show error message
        errorMessage.textContent = "Country not found. Please try again.";
        errorMessage.classList.remove("hidden"); 
    } finally {
        // Hide loading spinner
        spinner.classList.add("hidden");
    }
}



//EventListeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
    const country = document.getElementById('country-input').value;
    searchCountry(country);
    }
});
