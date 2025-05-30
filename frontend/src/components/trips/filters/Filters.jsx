import { SlArrowDown } from "react-icons/sl";

function Filters({ filters, onFiltersChange }) {
  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    onFiltersChange(updated);
  };

  return (
    <div className="filters">
      <div className="filters-left">
        {/* Status Select */}
        <div className="select-wrapper">
          <select value={filters.status} onChange={(e) => handleChange("status", e.target.value)} className="arrow-select">
            <option value="all">Alle reizen</option>
            <option value="past">Voorbije reizen</option>
            <option value="future">Toekomstige reizen</option>
          </select>
          <SlArrowDown className="select-icon" />
        </div>

        {/* Year Select */}
        <div className="select-wrapper">
          <select value={filters.year} onChange={(e) => handleChange("year", e.target.value)} className="arrow-select">
            <option value="">Alle jaren</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
          <SlArrowDown className="select-icon" />
        </div>
      </div>

      <div className="filters-right">
        <input className="searchbar" type="text" placeholder="Zoek op stad of land" value={filters.search} onChange={(e) => handleChange("search", e.target.value)} />

        <label>
          <input type="checkbox" checked={filters.myTrips} onChange={(e) => handleChange("myTrips", e.target.checked)} />
          Alleen mijn reizen
        </label>
      </div>
    </div>
  );
}

export default Filters;
