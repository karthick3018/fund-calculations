import SelectSearch from 'react-select-search';

const Select = ({ options,placeholder,isSearch,value,handleOptionChange,className }) => {
   return(
      <div className="w-full shadow-input rounded-md px-2">
       <SelectSearch className={className} options={options}  value={value} search={isSearch} name="fund" placeholder={placeholder} onChange={handleOptionChange} />
      </div>
   )
};

export default Select;
