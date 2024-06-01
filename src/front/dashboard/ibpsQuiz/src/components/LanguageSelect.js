import React from 'react';

const LanguageSelect = () => {
  return (
    <div className = 'bg-blue-400 flex justify-end'>
      <form className='m-1'>
  <label for="language">View In:</label>
  <select name="language" id="language" >
    <option value="English">English</option>
    <option value="Hindi">Hindi</option>
  </select>
</form>
    </div>
  )
}

export default LanguageSelect;
