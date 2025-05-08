// ------------------------------------------------------------------------

function handleLoader() {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  
  // ------------------------------------------------------------------------
  
  window.addEventListener('load', () => {
    if (loaderWrapper) {
      loaderWrapper.classList.add('hidden');
      
      // ------------------------------------------------------------------------
      
      setTimeout(() => {
        loaderWrapper.remove();
      }, 500);
    }
  });
}

// ------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', handleLoader); 