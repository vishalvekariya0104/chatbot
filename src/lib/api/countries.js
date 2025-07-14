export async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(country => ({
      name: country.name.common,
      code: country.cca2,
      dialCode: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching countries:", error);
    showToast('error', 'Failed to load country data.');
    return [];
  }
}