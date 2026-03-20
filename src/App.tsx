import './App.css';
import { Header } from './components/Header.jsx';
import { SearchForm } from './components/SearchForm.jsx';
import { ResultsTable } from './components/ResultsTable.jsx';
import { ExportBar } from './components/ExportBar.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { Footer } from './components/Footer.jsx';
import { CATEGORIES } from './constants/index.js';
import { useSearch } from './hooks/useSearch.js';
import { exportToExcel } from './utils/exporter.js';

function App() {
  const {
    city,
    setCity,
    selectedCategory,
    setSelectedCategory,
    radius,
    setRadius,
    results,
    loading,
    statusMessage,
    errorMessage,
    searchDone,
    handleSearch,
  } = useSearch();

  const selectedCategoryLabel = CATEGORIES[selectedCategory]?.label || 'Places';
  const displayCity = city || 'Unknown city';

  return (
    <div className="app-shell">
      <div className="app-grid">
        <Header />

        <main className="content-grid">
          <SearchForm
            city={city}
            onCityChange={setCity}
            radius={radius}
            onRadiusChange={setRadius}
            onSearch={handleSearch}
            loading={loading}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <section className="results-panel">
            {results.length > 0 ? (
              <div className="results-stack">
                <ExportBar
                  results={results}
                  city={displayCity}
                  onExport={() => exportToExcel(results, displayCity, selectedCategoryLabel)}
                />
                <ResultsTable results={results} categoryLabel={selectedCategoryLabel} />
              </div>
            ) : (
              <EmptyState searchDone={searchDone} />
            )}
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
