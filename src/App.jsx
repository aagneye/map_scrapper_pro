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

  const selectedCategoryOption = CATEGORIES[selectedCategory] || { label: 'Places' };

  return (
    <div className="app-shell">
      <Header />

      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-6 py-10">
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

        {results.length > 0 ? (
          <>
            <ExportBar
              results={results}
              city={city}
              categoryLabel={selectedCategoryOption.label}
              onExport={() => exportToExcel(results, city, selectedCategoryOption.label)}
            />
            <ResultsTable
              results={results}
              city={city}
              categoryLabel={selectedCategoryOption.label}
            />
          </>
        ) : (
          <EmptyState searchDone={searchDone} />
        )}
      </main>

      <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
        <Footer />
      </div>
    </div>
  );
}

export default App;
